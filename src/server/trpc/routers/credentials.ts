import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, tenantProcedure } from "../init";
import { integrationCredentials } from "@/server/db/schema";
import { getAllProviders, getAdapter, isProviderAvailable } from "@/lib/integrations";
import { encryptOAuthState } from "@/lib/integrations/oauth-state";
import { encrypt, decrypt } from "@/lib/crypto";
import { logAuditEntry } from "@/lib/autonomy/audit";
import { env } from "@/lib/env";

export const credentialsRouter = createRouter({
  // ─── List credentials (without encrypted data) ────────────────────

  list: tenantProcedure
    .input(z.object({ projectId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(integrationCredentials.tenantId, ctx.tenantId),
      ];
      if (input.projectId) {
        conditions.push(
          eq(integrationCredentials.projectId, input.projectId)
        );
      }

      const creds = await ctx.db.query.integrationCredentials.findMany({
        where: and(...conditions),
      });

      return creds.map((c) => ({
        id: c.id,
        provider: c.provider,
        accountLabel: c.accountLabel,
        authType: c.authType,
        status: c.status,
        expiresAt: c.expiresAt,
        createdAt: c.createdAt,
      }));
    }),

  // ─── Get all providers with connection status ─────────────────────

  providers: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const allProviders = getAllProviders();

      const existingCreds = await ctx.db.query.integrationCredentials.findMany({
        where: and(
          eq(integrationCredentials.tenantId, ctx.tenantId),
          eq(integrationCredentials.projectId, input.projectId)
        ),
      });

      return allProviders.map((provider) => {
        const cred = existingCreds.find((c) => c.provider === provider.id);
        return {
          ...provider,
          available: isProviderAvailable(provider.id),
          connected: !!cred && cred.status === "active",
          status: cred?.status ?? null,
          credentialId: cred?.id ?? null,
          accountLabel: cred?.accountLabel ?? null,
          connectedAt: cred?.createdAt ?? null,
        };
      });
    }),

  // ─── Initiate OAuth flow ──────────────────────────────────────────

  initiateOAuth: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        provider: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const adapter = getAdapter(input.provider);
      if (!adapter || adapter.config.authType !== "oauth2") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid OAuth provider",
        });
      }

      if (!isProviderAvailable(input.provider)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${adapter.config.name} OAuth is not configured. Set the required environment variables.`,
        });
      }

      const state = encryptOAuthState({
        projectId: input.projectId,
        tenantId: ctx.tenantId,
        provider: input.provider,
        timestamp: Date.now(),
      });

      const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/oauth/${input.provider}/callback`;
      const authorizeUrl = adapter.buildAuthorizeUrl(state, redirectUri);

      return { authorizeUrl };
    }),

  // ─── Store API key ────────────────────────────────────────────────

  storeApiKey: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        provider: z.string(),
        apiKey: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const adapter = getAdapter(input.provider);
      if (!adapter || adapter.config.authType !== "api_key") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid API key provider",
        });
      }

      // Test connection first
      const test = await adapter.testConnection(input.apiKey);
      if (!test.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Connection test failed: ${test.error}`,
        });
      }

      const accountLabel = await adapter.getAccountLabel(input.apiKey);

      const encrypted = encrypt({
        apiKey: input.apiKey,
        accountLabel,
      });

      // Delete existing, then insert
      await ctx.db
        .delete(integrationCredentials)
        .where(
          and(
            eq(integrationCredentials.tenantId, ctx.tenantId),
            eq(integrationCredentials.projectId, input.projectId),
            eq(integrationCredentials.provider, input.provider)
          )
        );

      await ctx.db.insert(integrationCredentials).values({
        tenantId: ctx.tenantId,
        projectId: input.projectId,
        provider: input.provider,
        accountLabel,
        authType: "api_key",
        encryptedData: encrypted.encryptedData,
        iv: encrypted.iv,
        keyVersion: encrypted.keyVersion,
        status: "active",
      });

      await logAuditEntry(
        ctx.tenantId,
        "integration.connected",
        ctx.userId,
        { provider: input.provider, accountLabel },
        input.projectId
      );

      return { success: true, accountLabel };
    }),

  // ─── Store webhook ────────────────────────────────────────────────

  storeWebhook: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        provider: z.string(),
        webhookUrl: z.string().url(),
        webhookSecret: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const adapter = getAdapter(input.provider);
      if (!adapter || adapter.config.authType !== "webhook") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid webhook provider",
        });
      }

      const accountLabel = await adapter.getAccountLabel(input.webhookUrl);

      const encrypted = encrypt({
        webhookUrl: input.webhookUrl,
        webhookSecret: input.webhookSecret,
      });

      // Delete existing, then insert
      await ctx.db
        .delete(integrationCredentials)
        .where(
          and(
            eq(integrationCredentials.tenantId, ctx.tenantId),
            eq(integrationCredentials.projectId, input.projectId),
            eq(integrationCredentials.provider, input.provider)
          )
        );

      await ctx.db.insert(integrationCredentials).values({
        tenantId: ctx.tenantId,
        projectId: input.projectId,
        provider: input.provider,
        accountLabel,
        authType: "webhook",
        encryptedData: encrypted.encryptedData,
        iv: encrypted.iv,
        keyVersion: encrypted.keyVersion,
        status: "active",
      });

      await logAuditEntry(
        ctx.tenantId,
        "integration.webhook_configured",
        ctx.userId,
        { provider: input.provider },
        input.projectId
      );

      return { success: true, accountLabel };
    }),

  // ─── Disconnect integration ───────────────────────────────────────

  disconnect: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const cred = await ctx.db.query.integrationCredentials.findFirst({
        where: and(
          eq(integrationCredentials.id, input.id),
          eq(integrationCredentials.tenantId, ctx.tenantId)
        ),
      });

      if (!cred) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Try to revoke at provider level (best effort)
      const adapter = getAdapter(cred.provider);
      if (adapter?.revokeAccess && cred.authType === "oauth2") {
        try {
          const decrypted = decrypt({
            encryptedData: cred.encryptedData as Buffer,
            iv: cred.iv as Buffer,
            keyVersion: cred.keyVersion,
          });
          if (typeof decrypted.accessToken === "string") {
            await adapter.revokeAccess(decrypted.accessToken);
          }
        } catch {
          // Best effort — continue with deletion
        }
      }

      await ctx.db
        .delete(integrationCredentials)
        .where(eq(integrationCredentials.id, input.id));

      await logAuditEntry(
        ctx.tenantId,
        "integration.disconnected",
        ctx.userId,
        { provider: cred.provider },
        cred.projectId ?? undefined
      );

      return { success: true };
    }),

  // ─── Test connection ──────────────────────────────────────────────

  testConnection: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const cred = await ctx.db.query.integrationCredentials.findFirst({
        where: and(
          eq(integrationCredentials.id, input.id),
          eq(integrationCredentials.tenantId, ctx.tenantId)
        ),
      });

      if (!cred) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const adapter = getAdapter(cred.provider);
      if (!adapter) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unknown provider",
        });
      }

      const decrypted = decrypt({
        encryptedData: cred.encryptedData as Buffer,
        iv: cred.iv as Buffer,
        keyVersion: cred.keyVersion,
      });

      const token =
        (decrypted.accessToken as string) ??
        (decrypted.apiKey as string) ??
        (decrypted.webhookUrl as string) ??
        "";

      const result = await adapter.testConnection(token);

      // Update status based on test result
      if (!result.success) {
        await ctx.db
          .update(integrationCredentials)
          .set({ status: "error" })
          .where(eq(integrationCredentials.id, input.id));
      } else if (cred.status === "error") {
        await ctx.db
          .update(integrationCredentials)
          .set({ status: "active" })
          .where(eq(integrationCredentials.id, input.id));
      }

      return result;
    }),
});
