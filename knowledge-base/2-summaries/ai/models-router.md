# AI Models & LLM Router | v1.0.0 | 2026-02-03

ATR uses a smart LLM router to select the optimal model based on task complexity, balancing quality and cost.

**Available Models:**
- Claude Opus — Complex reasoning, architecture decisions, critical business strategy
- Gemini 3.0 — Complex tasks, multi-modal analysis, large context
- Claude Sonnet — Standard development tasks, feature implementation
- Gemini Flash — Fast iterations, simple code changes, quick responses
- Claude Haiku — Simple queries, formatting, small edits, status checks

**Routing Logic:**
- Complex tasks (architecture, strategy, multi-file refactors) → Opus / Gemini 3.0
- Standard tasks (feature development, research, documentation) → Sonnet
- Simple tasks (quick edits, formatting, status) → Haiku / Gemini Flash

**Routing Criteria:** Task complexity score based on — scope (single file vs multi-file), domain (code vs business vs research), user context, estimated token usage, and latency requirements.

**Cost Optimization:** Always use the cheapest model that can handle the task effectively. Track cost per task category to continuously optimize routing.
