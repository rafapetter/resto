import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { integrationCredentials, tenants } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { getAdapter } from "@/lib/integrations/registry";
import { decryptOAuthState } from "@/lib/integrations/oauth-state";
import { encrypt } from "@/lib/crypto";
import { logAuditEntry } from "@/lib/autonomy/audit";
import { env } from "@/lib/env";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle error from provider
  if (error) {
    return NextResponse.redirect(
      new URL("/projects?error=oauth_denied", env.NEXT_PUBLIC_APP_URL)
    );
  }

  // Validate code and state
  if (!code || !stateParam) {
    return NextResponse.redirect(
      new URL("/projects?error=oauth_invalid", env.NEXT_PUBLIC_APP_URL)
    );
  }

  // Decrypt and validate state (CSRF + expiry)
  let state;
  try {
    state = decryptOAuthState(stateParam);
  } catch {
    return NextResponse.redirect(
      new URL("/projects?error=oauth_expired", env.NEXT_PUBLIC_APP_URL)
    );
  }

  // Verify state provider matches route
  if (state.provider !== provider) {
    return NextResponse.redirect(
      new URL("/projects?error=oauth_invalid", env.NEXT_PUBLIC_APP_URL)
    );
  }

  // Verify authenticated user belongs to the state's tenant
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(
      new URL("/sign-in", env.NEXT_PUBLIC_APP_URL)
    );
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.clerkUserId, userId),
  });

  if (!tenant || tenant.id !== state.tenantId) {
    return NextResponse.redirect(
      new URL("/projects?error=oauth_invalid", env.NEXT_PUBLIC_APP_URL)
    );
  }

  // Get adapter
  const adapter = getAdapter(provider);
  if (!adapter || adapter.config.authType !== "oauth2") {
    return NextResponse.redirect(
      new URL(
        `/projects/${state.projectId}/integrations?error=unknown_provider`,
        env.NEXT_PUBLIC_APP_URL
      )
    );
  }

  const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/oauth/${provider}/callback`;

  try {
    // Exchange code for tokens
    const tokenResponse = await adapter.exchangeCode(code, redirectUri);

    // Get account label
    const accountLabel = await adapter.getAccountLabel(tokenResponse.accessToken);

    // Encrypt credentials
    const encrypted = encrypt({
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      tokenType: tokenResponse.tokenType,
      scope: tokenResponse.scope,
      accountLabel,
      expiresAt: tokenResponse.expiresIn
        ? new Date(Date.now() + tokenResponse.expiresIn * 1000).toISOString()
        : undefined,
    });

    // Delete existing credential for same provider+project, then insert new
    await db
      .delete(integrationCredentials)
      .where(
        and(
          eq(integrationCredentials.tenantId, state.tenantId),
          eq(integrationCredentials.projectId, state.projectId),
          eq(integrationCredentials.provider, provider)
        )
      );

    await db.insert(integrationCredentials).values({
      tenantId: state.tenantId,
      projectId: state.projectId,
      provider,
      authType: "oauth2",
      encryptedData: encrypted.encryptedData,
      iv: encrypted.iv,
      keyVersion: encrypted.keyVersion,
      accountLabel,
      status: "active",
      expiresAt: tokenResponse.expiresIn
        ? new Date(Date.now() + tokenResponse.expiresIn * 1000)
        : null,
    });

    // Audit log
    await logAuditEntry(
      state.tenantId,
      "integration.connected",
      userId,
      { provider, accountLabel },
      state.projectId
    );

    return NextResponse.redirect(
      new URL(
        `/projects/${state.projectId}/integrations?connected=${provider}`,
        env.NEXT_PUBLIC_APP_URL
      )
    );
  } catch (err) {
    console.error(`OAuth callback error for ${provider}:`, err);
    return NextResponse.redirect(
      new URL(
        `/projects/${state.projectId}/integrations?error=oauth_exchange_failed`,
        env.NEXT_PUBLIC_APP_URL
      )
    );
  }
}
