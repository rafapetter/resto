# Code Generation Service | v1.0.0 | 2026-02-03

An abstraction layer that routes code tasks to the optimal backend. Provider-agnostic, cost-optimized, resilient.

**Available Backends:**
1. **Direct Apply** — Agent modifies files directly. For config changes, small edits, typo fixes. Fastest, cheapest.
2. **Claude API** — Direct LLM code generation. For new components, moderate features. Fast, good quality.
3. **Cursor Cloud Agents** — Full IDE intelligence. For complex multi-file features, refactors. User-connected.
4. **Claude Code** — CLI-based code generation. For complex tasks. User-connected.
5. **Codex (OpenAI)** — Alternative code gen. User-connected.
6. **OpenClaw** — On-premise option. No cloud dependency. For self-hosted deployments.

**Routing Logic:**
- Simple edit → Direct Apply
- Moderate feature → Claude API (fallback if no tool connected)
- Complex feature → User's connected code gen tool (Cursor/Claude Code/Codex)
- On-premise → OpenClaw

**Important:** Users connect their OWN code gen tool accounts. ATR does not provide its own code gen — if no tool is connected, fallback is direct LLM API generation. Agent nudges users to connect a tool for better results.

**Abstraction:** The orchestrator calls a unified interface. The router decides which backend handles it. New backends can be added without changing orchestration logic.
