# Model Routing Rules | v1.0.0 | 2026-02-03

Rules for when to use each LLM model. Optimizes for quality vs cost across all platform operations.

**Tier 1 — Premium (Complex Tasks):**
- Models: Claude Opus, Gemini 3.0
- Use when: Architecture decisions, multi-step business strategy, complex multi-file code generation, critical document generation, risk analysis
- Trigger: High complexity score, user-flagged importance, multi-domain tasks

**Tier 2 — Standard (Regular Tasks):**
- Models: Claude Sonnet
- Use when: Feature implementation, research summaries, documentation updates, standard code generation, conversation
- Trigger: Moderate complexity, single-domain tasks

**Tier 3 — Fast (Simple Tasks):**
- Models: Claude Haiku, Gemini Flash
- Use when: Quick edits, formatting, status checks, simple Q&A, config changes, knowledge base lookups
- Trigger: Low complexity, single-action tasks, latency-sensitive

**Cost Management:**
- Track cost per task category weekly
- Alert if cost per user exceeds profitable threshold
- Continuously optimize routing based on quality-cost outcomes
- User's credit consumption tied to actual model costs (transparent)
