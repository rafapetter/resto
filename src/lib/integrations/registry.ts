import { githubAdapter } from "./adapters/github";
import { vercelAdapter } from "./adapters/vercel";
import { stripeAdapter } from "./adapters/stripe";
import { webhookAdapter } from "./adapters/webhook";
import type { IntegrationAdapter, ProviderConfig } from "./types";

// ─── Adapter Registry ───────────────────────────────────────────────

const ADAPTERS: Record<string, IntegrationAdapter> = {
  github: githubAdapter,
  vercel: vercelAdapter,
  stripe: stripeAdapter,
  webhook: webhookAdapter,
};

export function getAdapter(providerId: string): IntegrationAdapter | undefined {
  return ADAPTERS[providerId];
}

export function getAllProviders(): ProviderConfig[] {
  return Object.values(ADAPTERS).map((a) => a.config);
}

export function getOAuthProviders(): ProviderConfig[] {
  return getAllProviders().filter((p) => p.authType === "oauth2");
}

/**
 * Check if a provider's required env vars are configured.
 * For OAuth2 providers, both client ID and secret must be set.
 * API key and webhook providers are always available (no env vars needed).
 */
export function isProviderAvailable(providerId: string): boolean {
  const adapter = ADAPTERS[providerId];
  if (!adapter) return false;

  if (adapter.config.authType === "oauth2" && adapter.config.oauth2) {
    const clientId = process.env[adapter.config.oauth2.clientIdEnvVar];
    const clientSecret = process.env[adapter.config.oauth2.clientSecretEnvVar];
    return !!clientId && !!clientSecret;
  }

  // API key and webhook providers are always available
  return true;
}
