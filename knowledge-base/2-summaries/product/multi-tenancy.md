# Multi-Tenancy & Isolation | v1.0.0 | 2026-02-03

Each ATR customer gets a fully isolated AI co-founder environment.

**Isolation Scope:**
- Separate knowledge base (3-tier structure per tenant)
- Separate credential vault (encrypted per tenant)
- Separate agent state and conversation history
- Separate connected third-party accounts
- Tenant ID on every database row

**Implementation:** Logical isolation at database level (shared infrastructure, tenant ID filtering). This is the right balance of cost efficiency and security for v1.

**Future Evolution:** Database-level isolation for growth tiers, full environment isolation for enterprise customers.

**Deployment Model:**
- Default: Hosted on ATR infrastructure (Vercel ecosystem). Zero infrastructure concerns for the user.
- Eject option: Customers can export their full codebase and deploy to their own infrastructure when ready. Platform is the builder, hosting is optional.

**Data Ownership:** Customer owns all their data, code, and connected accounts. ATR operates on their behalf with granted permissions.
