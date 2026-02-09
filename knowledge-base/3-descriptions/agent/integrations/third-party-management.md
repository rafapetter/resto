# Third-Party Integration Management — Detailed Design | v1.0.0 | 2026-02-03

## Overview

Resto operates real third-party services on behalf of each customer. All accounts are customer-owned. The platform stores credentials securely and provides a unified interface for the agent to interact with any connected service.

## Integration Lifecycle

### 1. Discovery (During Planning)
Resto identifies which services the business will need based on:
- Type of application (SaaS, e-commerce, marketplace)
- Features planned
- GTM strategy
- User's existing accounts

### 2. Connection (During Onboarding)
For each required service:
1. Resto explains why it's needed
2. Guides user through OAuth flow (or API key entry)
3. Tests the connection
4. Stores credentials (encrypted, AES-256)
5. Maps permissions granted

### 3. Operation (Post-Setup)
- User speaks in business language ("deploy my app")
- Master Agent determines which integration(s) to invoke
- Retrieves encrypted credentials just-in-time
- Executes action via integration adapter
- Logs action in audit trail
- Returns result to user

### 4. Maintenance
- Token refresh for OAuth connections (automatic)
- Credential rotation reminders
- Permission verification before sensitive operations
- Disconnection and cleanup when user removes a service

## Integration Adapter Pattern

Each third-party service has an adapter:

```typescript
interface IntegrationAdapter {
  // Identity
  id: string;                    // e.g., 'github', 'vercel', 'stripe'
  name: string;                  // e.g., 'GitHub'
  category: IntegrationCategory; // e.g., 'development', 'hosting', 'payments'
  
  // Auth
  authType: 'oauth' | 'api_key' | 'both';
  oauthConfig?: OAuthConfig;
  
  // Capabilities
  actions: ActionDefinition[];   // what the adapter can do
  
  // Lifecycle
  connect(credentials: EncryptedCredentials): Promise<ConnectionResult>;
  testConnection(): Promise<boolean>;
  disconnect(): Promise<void>;
  
  // Execution
  execute(action: string, params: Record<string, any>): Promise<ActionResult>;
}
```

## V1 Priority Integrations

### GitHub (Development)
Actions: create repo, push code, create PR, manage issues, configure CI/CD
Auth: OAuth (GitHub App)

### Vercel (Hosting)
Actions: create project, deploy, manage domains, configure env vars, view logs
Auth: OAuth

### Stripe (Payments)
Actions: create products, set up subscriptions, manage customers, view revenue
Auth: OAuth (Stripe Connect)

### Gmail (Communication)
Actions: send emails, read inbox, manage contacts
Auth: OAuth (Google API)

### Google Analytics (Analytics)
Actions: view traffic, set up events, create dashboards
Auth: OAuth (Google API)

### Domain Registrar (Domains)
Actions: search domains, purchase, configure DNS
Auth: API key (varies by provider)

## Credential Storage Schema

```sql
CREATE TABLE integration_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  integration_id VARCHAR(50) NOT NULL,
  auth_type VARCHAR(20) NOT NULL,
  encrypted_credentials BYTEA NOT NULL,
  permissions_granted JSONB,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active',
  
  UNIQUE(tenant_id, integration_id)
);

CREATE TABLE integration_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  integration_id VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  params_hash VARCHAR(64),
  result_status VARCHAR(20),
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  duration_ms INTEGER,
  error_message TEXT
);
```

## MCP Protocol Integration

Where supported, integrations use Model Context Protocol (MCP) for standardized agent-tool communication. This provides:
- Structured tool definitions
- Typed parameters and responses
- Standard error handling
- Composability with CopilotKit

## Security Boundaries

- Credentials decrypted only during action execution
- Each action scoped to minimum required permissions
- Rate limiting per integration to prevent abuse
- Automatic token refresh (no user intervention)
- Alert user if a connection fails or permissions change
- Quarterly credential rotation recommendations
