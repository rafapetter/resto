import type { IntegrationAdapter, TokenResponse, ConnectionTestResult } from "../types";

const config = {
  id: "github",
  name: "GitHub",
  description: "Connect your GitHub account for repository management and code deployment.",
  authType: "oauth2" as const,
  icon: "github",
  oauth2: {
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    scopes: ["repo", "read:user"],
    clientIdEnvVar: "GITHUB_CLIENT_ID",
    clientSecretEnvVar: "GITHUB_CLIENT_SECRET",
  },
};

function getClientCredentials() {
  const clientId = process.env[config.oauth2.clientIdEnvVar];
  const clientSecret = process.env[config.oauth2.clientSecretEnvVar];
  if (!clientId || !clientSecret) {
    throw new Error("GitHub OAuth credentials not configured");
  }
  return { clientId, clientSecret };
}

export const githubAdapter: IntegrationAdapter = {
  config,

  buildAuthorizeUrl(state: string, redirectUri: string): string {
    const { clientId } = getClientCredentials();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: config.oauth2.scopes.join(" "),
      state,
    });
    return `${config.oauth2.authorizeUrl}?${params.toString()}`;
  },

  async exchangeCode(code: string, redirectUri: string): Promise<TokenResponse> {
    const { clientId, clientSecret } = getClientCredentials();

    const response = await fetch(config.oauth2.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub token exchange failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description ?? data.error}`);
    }

    return {
      accessToken: data.access_token,
      tokenType: data.token_type ?? "bearer",
      scope: data.scope,
      // GitHub tokens are long-lived, no refresh token or expiry
    };
  },

  async testConnection(token: string): Promise<ConnectionTestResult> {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}` };
      }

      const user = await response.json();
      return { success: true, accountName: user.login };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async getAccountLabel(token: string): Promise<string> {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      return "Unknown";
    }

    const user = await response.json();
    return user.login ?? "Unknown";
  },

  // GitHub tokens don't have a standard revocation endpoint for OAuth apps
  // (only GitHub Apps support token revocation via API)
};
