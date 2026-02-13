// ─── Provider Configuration ─────────────────────────────────────────

export type IntegrationAuthType = "oauth2" | "api_key" | "webhook";

export type OAuth2Config = {
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientIdEnvVar: string;
  clientSecretEnvVar: string;
};

export type ProviderConfig = {
  id: string;
  name: string;
  description: string;
  authType: IntegrationAuthType;
  icon: string;
  oauth2?: OAuth2Config;
};

// ─── Adapter Interface ──────────────────────────────────────────────

export type TokenResponse = {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  scope?: string;
  expiresIn?: number; // seconds
};

export type ConnectionTestResult = {
  success: boolean;
  accountName?: string;
  error?: string;
};

export type IntegrationAdapter = {
  config: ProviderConfig;
  buildAuthorizeUrl(state: string, redirectUri: string): string;
  exchangeCode(code: string, redirectUri: string): Promise<TokenResponse>;
  refreshAccessToken?(refreshToken: string): Promise<TokenResponse>;
  testConnection(token: string): Promise<ConnectionTestResult>;
  getAccountLabel(token: string): Promise<string>;
  revokeAccess?(accessToken: string): Promise<void>;
};

// ─── OAuth State ────────────────────────────────────────────────────

export type OAuthState = {
  projectId: string;
  tenantId: string;
  provider: string;
  timestamp: number;
};
