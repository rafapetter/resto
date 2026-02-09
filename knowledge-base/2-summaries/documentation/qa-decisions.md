# Q&A Decisions Log | v1.0.0 | 2026-02-03

Record of all strategic decisions made during the ATR platform planning phase.

**Q1 — Business Model:** SaaS platform (A). ATR is the provider, customers are entrepreneurs.
**Q2 — Starting Point:** Idea stage (A). AI co-founder (Cursor) acts as the full dev team.
**Q3 — Target Applications:** SaaS tools (C, priority 1), E-commerce (D, priority 2), Marketplaces (B, priority 3).
**Q4 — Orchestration:** Hybrid (C). Use existing tools for code gen, build custom for business logic.
**Q5 — UI Paradigm:** Chat/Voice-first (A) with dashboard as complementary view (C). Agents can do everything through chat.
**Q6 — Autonomy:** User-configurable (D). Goal is full autonomy with guardrails (A). User chooses permissions.
**Q7 — Knowledge Base Maintenance:** Fully automated with imports (D). Users rarely touch it directly.
**Q8 — Tech Stack:** Recommendation-based (B). All-TypeScript, Vercel-native.
**Q9 — CopilotKit:** Yes, as orchestration framework. Vapi + Deepgram for voice. All-TypeScript preferred.
**Q10 — Customer App Hosting:** Hybrid (C). Hosted by default, eject option available.
**Q11 — Monetization:** Hybrid subscription + usage with credits/wallet (C+E).
**Q12 — Onboarding:** Templates → Wizard → Conversation (C → A → B).
**Q13 — First Output:** Comprehensive plan with persistent checklist (B).
**Q14 — Agent Architecture:** Hierarchical with orchestrator (D). Master agent, contextual instances.
**Q15 — Code Generation:** Abstraction service with router (D) + direct apply option.
**Q16 — Integrations:** Customer-owned accounts, agent-operated (B). Setup during planning.
**Q17 — Security:** Encrypted in DB, never in memory. Simple but extensible.
**Q18 — Name:** ATR (All The Rest). Agent: Resto. alltherest.world.
**Q19 — Product Relationship:** Standalone product, linked ecosystem (B). Resto is core.
**Q20 — Agent Persona:** Customizable (B) with branded default (A). Named "Resto."
