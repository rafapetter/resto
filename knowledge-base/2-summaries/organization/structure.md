# ATR Structure | v1.0.0 | 2026-02-03

ATR operates as a SaaS platform provider. The AI co-founder "Resto" is the core product, supported by an ecosystem of programs and services.

**Platform Components:**
1. **Resto Agent Platform** — The cloud-based AI co-founder (core product)
2. **ATR Ecosystem** — Hackathons, Fellowship, Accelerator programs
3. **ATR Academy** — Premium training workshops and educational programs

**Customer Relationship:** B2C — direct to entrepreneurs and business executives. Platform serves individual users, each with their own isolated AI co-founder instance.

**Multi-tenancy:** Each customer gets their own isolated environment — separate knowledge base, credentials, agent state, and connected accounts. Data isolation at database level with tenant ID, designed to evolve toward stronger isolation for enterprise tiers.

**Deployment Model:** Hybrid — hosted by default on ATR infrastructure (Vercel ecosystem). Customers can eject to their own infrastructure later when they want full control.
