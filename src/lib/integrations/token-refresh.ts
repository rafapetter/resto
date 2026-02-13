import { db } from "@/server/db";
import { integrationCredentials } from "@/server/db/schema";
import { lt, eq, and } from "drizzle-orm";
import { getAdapter } from "./registry";
import { decrypt, encrypt } from "@/lib/crypto";

/**
 * Refresh OAuth2 tokens that are expiring within the next hour.
 * Called by the cron endpoint or manually.
 */
export async function refreshExpiringTokens(): Promise<{
  refreshed: number;
  expired: number;
  errors: number;
}> {
  const expiringThreshold = new Date(Date.now() + 60 * 60 * 1000);

  const expiring = await db.query.integrationCredentials.findMany({
    where: and(
      eq(integrationCredentials.status, "active"),
      eq(integrationCredentials.authType, "oauth2"),
      lt(integrationCredentials.expiresAt, expiringThreshold)
    ),
  });

  let refreshed = 0;
  let expired = 0;
  let errors = 0;

  for (const cred of expiring) {
    const adapter = getAdapter(cred.provider);
    if (!adapter?.refreshAccessToken) {
      // Provider doesn't support refresh (e.g., GitHub)
      continue;
    }

    try {
      const decrypted = decrypt({
        encryptedData: cred.encryptedData as Buffer,
        iv: cred.iv as Buffer,
        keyVersion: cred.keyVersion,
      });

      if (typeof decrypted.refreshToken !== "string") {
        continue;
      }

      const newTokens = await adapter.refreshAccessToken(
        decrypted.refreshToken
      );

      const encrypted = encrypt({
        ...decrypted,
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken ?? decrypted.refreshToken,
        expiresAt: newTokens.expiresIn
          ? new Date(
              Date.now() + newTokens.expiresIn * 1000
            ).toISOString()
          : undefined,
      });

      await db
        .update(integrationCredentials)
        .set({
          encryptedData: encrypted.encryptedData,
          iv: encrypted.iv,
          keyVersion: encrypted.keyVersion,
          expiresAt: newTokens.expiresIn
            ? new Date(Date.now() + newTokens.expiresIn * 1000)
            : null,
          status: "active",
        })
        .where(eq(integrationCredentials.id, cred.id));

      refreshed++;
    } catch (error) {
      console.error(
        `Token refresh failed for ${cred.provider} (${cred.id}):`,
        error
      );

      await db
        .update(integrationCredentials)
        .set({ status: "expired" })
        .where(eq(integrationCredentials.id, cred.id));

      expired++;
      errors++;
    }
  }

  return { refreshed, expired, errors };
}
