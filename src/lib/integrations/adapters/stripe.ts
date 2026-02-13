import type { IntegrationAdapter, TokenResponse, ConnectionTestResult } from "../types";

const config = {
  id: "stripe",
  name: "Stripe",
  description: "Connect Stripe for payment processing and subscription management.",
  authType: "api_key" as const,
  icon: "credit_card",
};

export const stripeAdapter: IntegrationAdapter = {
  config,

  // Not used for API key auth, but required by the interface
  buildAuthorizeUrl(): string {
    throw new Error("Stripe uses API key auth, not OAuth2");
  },

  async exchangeCode(): Promise<TokenResponse> {
    throw new Error("Stripe uses API key auth, not OAuth2");
  },

  async testConnection(apiKey: string): Promise<ConnectionTestResult> {
    try {
      const response = await fetch("https://api.stripe.com/v1/balance", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: data.error?.message ?? `HTTP ${response.status}`,
        };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async getAccountLabel(apiKey: string): Promise<string> {
    try {
      const response = await fetch("https://api.stripe.com/v1/account", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!response.ok) return "Stripe Account";

      const data = await response.json();
      return (
        data.settings?.dashboard?.display_name ??
        data.business_profile?.name ??
        "Stripe Account"
      );
    } catch {
      return "Stripe Account";
    }
  },
};
