# Credential Architecture — Detailed Design | v1.0.0 | 2026-02-03

## Overview

ATR manages sensitive credentials (OAuth tokens, API keys) for each tenant's connected third-party services. Security is paramount — these credentials grant access to real business accounts.

## Encryption Strategy

### Algorithm: AES-256-GCM
- Industry standard symmetric encryption
- GCM mode provides authenticated encryption (integrity + confidentiality)
- 256-bit key length

### Key Management
- Master encryption key stored as environment variable (Vercel encrypted env vars)
- Per-tenant derived keys using HKDF (HMAC-based Key Derivation Function)
- Key rotation: master key rotatable without re-encrypting all data (new data uses new key, old data decrypted with old key via key versioning)

### Encryption Flow
```
User connects account
  → OAuth token / API key received
  → Derive tenant-specific key (HKDF from master + tenant_id)
  → Encrypt with AES-256-GCM
  → Store encrypted blob + IV + key version in Postgres
  → Clear plaintext from memory immediately
```

### Decryption Flow
```
Agent needs to execute action
  → Load encrypted credential from Postgres
  → Derive tenant-specific key
  → Decrypt in memory
  → Execute API call
  → Clear plaintext from memory immediately
  → Log access in audit trail
```

## Database Schema

```sql
-- Encrypted credentials
CREATE TABLE integration_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  integration_id VARCHAR(50) NOT NULL,
  auth_type VARCHAR(20) NOT NULL CHECK (auth_type IN ('oauth', 'api_key')),
  
  -- Encrypted data
  encrypted_data BYTEA NOT NULL,
  iv BYTEA NOT NULL,
  key_version INTEGER NOT NULL DEFAULT 1,
  
  -- Metadata (not encrypted)
  scopes JSONB,
  expires_at TIMESTAMPTZ,
  refresh_token_encrypted BYTEA,
  refresh_token_iv BYTEA,
  
  -- Lifecycle
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  last_refreshed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
  
  UNIQUE(tenant_id, integration_id),
  INDEX idx_credentials_tenant (tenant_id),
  INDEX idx_credentials_status (status)
);

-- Audit trail
CREATE TABLE credential_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  integration_id VARCHAR(50) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  task_id UUID,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN NOT NULL,
  error_message TEXT,
  ip_address INET,
  
  INDEX idx_audit_tenant_time (tenant_id, accessed_at DESC)
);
```

## OAuth Token Refresh

```typescript
async function getValidToken(tenantId: string, integrationId: string): Promise<string> {
  const credential = await db.credentials.findUnique({
    where: { tenant_id_integration_id: { tenantId, integrationId } }
  });
  
  if (!credential) throw new Error('Integration not connected');
  if (credential.status !== 'active') throw new Error('Integration inactive');
  
  const token = decrypt(credential.encrypted_data, credential.iv, credential.key_version);
  
  // Check if expired and refresh if needed
  if (credential.expires_at && credential.expires_at < new Date()) {
    const refreshToken = decrypt(credential.refresh_token_encrypted, credential.refresh_token_iv, credential.key_version);
    const newTokens = await refreshOAuthToken(integrationId, refreshToken);
    
    // Store new tokens
    await updateCredentials(tenantId, integrationId, newTokens);
    
    return newTokens.access_token;
  }
  
  // Log access
  await logCredentialAccess(tenantId, integrationId, 'token_retrieval', true);
  
  return token;
}
```

## Security Boundaries

### What We Store
- Encrypted OAuth access tokens
- Encrypted OAuth refresh tokens
- Encrypted API keys
- Scopes/permissions metadata (plaintext — not sensitive)
- Connection status and timestamps

### What We NEVER Store
- User passwords
- Full credit card numbers
- Unencrypted credentials anywhere (including logs)

### What We NEVER Do
- Log credential values (even encrypted)
- Send credentials to third parties (except the intended service)
- Allow cross-tenant credential access
- Persist decrypted credentials beyond the action scope

## Future Compliance Hooks

### GDPR Ready
- Data export API: export all tenant data including credential metadata (not values)
- Data deletion API: securely wipe all credentials and audit logs for a tenant
- Consent tracking: record when user granted each integration access

### SOC2 Ready
- Audit logging already comprehensive
- Access controls enforced at application level
- Encryption at rest and in transit
- Key rotation procedures defined
- Incident response plan (TBD)

## Monitoring & Alerts

- Alert on: failed authentication attempts (3+ in sequence)
- Alert on: credential access from unusual patterns
- Alert on: bulk credential access in short timeframe
- Alert on: token refresh failures (integration may be disconnected)
- Weekly report: credential health status per tenant
