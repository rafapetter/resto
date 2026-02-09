# Agent Integrations | v1.0.0 | 2026-02-03

Resto connects to third-party services through customer-owned accounts. Users grant access via OAuth or API keys during the business planning phase. After setup, integrations are invisible — the user speaks in business language, the agent translates to actions.

**Integration Categories:**
- **Development:** GitHub, GitLab, Cursor Cloud, Claude Code, Codex
- **Hosting & Infra:** Vercel, AWS, GCP, Cloudflare
- **Payments:** Stripe, PayPal
- **Communication:** Gmail, Outlook, Slack, Discord
- **Domains:** Namecheap, GoDaddy, Cloudflare
- **Marketing:** Mailchimp, HubSpot, social media APIs
- **Analytics:** Google Analytics, Mixpanel, PostHog
- **CRM:** HubSpot, Salesforce
- **Finance/Legal:** QuickBooks, Xero

**Credential Management:** All credentials encrypted (AES-256) in the platform database. Decrypted only at moment of use, never persisted in memory. OAuth preferred, API keys as fallback. Full audit logging on every credential access.

**MCP Protocol:** Where available, integrations use MCP (Model Context Protocol) for standardized agent-tool communication.
