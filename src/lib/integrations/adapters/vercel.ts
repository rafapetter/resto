import type { IntegrationAdapter, TokenResponse, ConnectionTestResult } from "../types";

const config = {
  id: "vercel",
  name: "Vercel",
  description: "Connect Vercel for automatic deployments and hosting management.",
  authType: "oauth2" as const,
  icon: "globe",
  oauth2: {
    authorizeUrl: "https://vercel.com/integrations/atr-resto/new",
    tokenUrl: "https://api.vercel.com/v2/oauth/access_token",
    scopes: [],
    clientIdEnvVar: "VERCEL_CLIENT_ID",
    clientSecretEnvVar: "VERCEL_CLIENT_SECRET",
  },
};

function getClientCredentials() {
  const clientId = process.env[config.oauth2.clientIdEnvVar];
  const clientSecret = process.env[config.oauth2.clientSecretEnvVar];
  if (!clientId || !clientSecret) {
    throw new Error("Vercel OAuth credentials not configured");
  }
  return { clientId, clientSecret };
}

export const vercelAdapter: IntegrationAdapter = {
  config,

  buildAuthorizeUrl(state: string, redirectUri: string): string {
    const { clientId } = getClientCredentials();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state,
    });
    return `${config.oauth2.authorizeUrl}?${params.toString()}`;
  },

  async exchangeCode(code: string, redirectUri: string): Promise<TokenResponse> {
    const { clientId, clientSecret } = getClientCredentials();

    const response = await fetch(config.oauth2.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Vercel token exchange failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type ?? "bearer",
      expiresIn: data.expires_in,
    };
  },

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const { clientId, clientSecret } = getClientCredentials();

    const response = await fetch(config.oauth2.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error(`Vercel token refresh failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type ?? "bearer",
      expiresIn: data.expires_in,
    };
  },

  async testConnection(token: string): Promise<ConnectionTestResult> {
    try {
      const response = await fetch("https://api.vercel.com/v2/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { success: true, accountName: data.user?.username ?? data.user?.name };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async getAccountLabel(token: string): Promise<string> {
    const response = await fetch("https://api.vercel.com/v2/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return "Unknown";

    const data = await response.json();
    return data.user?.username ?? data.user?.name ?? "Unknown";
  },
};
