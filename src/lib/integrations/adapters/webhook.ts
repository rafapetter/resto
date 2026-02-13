import type { IntegrationAdapter, TokenResponse, ConnectionTestResult } from "../types";

const config = {
  id: "webhook",
  name: "Custom Webhook",
  description: "Configure a webhook URL to receive project event notifications.",
  authType: "webhook" as const,
  icon: "webhook",
};

export const webhookAdapter: IntegrationAdapter = {
  config,

  // Not used for webhook auth
  buildAuthorizeUrl(): string {
    throw new Error("Webhook does not use OAuth2");
  },

  async exchangeCode(): Promise<TokenResponse> {
    throw new Error("Webhook does not use OAuth2");
  },

  async testConnection(webhookUrl: string): Promise<ConnectionTestResult> {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "connection_test",
          source: "atr-resto",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        return { success: true };
      }

      return {
        success: false,
        error: `Webhook returned HTTP ${response.status}`,
      };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async getAccountLabel(webhookUrl: string): Promise<string> {
    try {
      const url = new URL(webhookUrl);
      return url.hostname;
    } catch {
      return "Custom Webhook";
    }
  },
};
