# Security & Credential Management | v1.0.0 | 2026-02-03

Simple but extensible security architecture. Designed for v1 with hooks for future compliance (SOC2, GDPR).

**Credential Storage:**
- All credentials (OAuth tokens, API keys) encrypted with AES-256 at application level
- Stored in Neon PostgreSQL alongside tenant data
- Encryption keys managed at environment level, rotatable
- Decrypted ONLY at moment of use within action execution
- NEVER persisted in memory beyond the action scope

**Authentication Preference:**
- OAuth preferred wherever available (token refresh, no password storage)
- API keys as fallback (encrypted storage)
- User connects accounts during planning phase via secure OAuth flows

**Audit & Logging:**
- Full audit log for every credential access
- Every agent action logged with timestamp, action type, and result
- Audit trail accessible to user in dashboard

**Data Isolation:**
- Tenant ID on every database row
- Application-level enforcement of tenant boundaries
- No cross-tenant data access possible

**Future Compliance Hooks:**
- Data export API (for GDPR right to portability)
- Data deletion API (for GDPR right to erasure)
- Consent tracking framework (ready to activate)
- SOC2 audit trail foundation already in logging
