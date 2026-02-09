# Agent Tools | v1.0.0 | 2026-02-03

Resto has access to a comprehensive set of tools organized by function. All tools operate through user-connected third-party accounts (OAuth/API keys configured during the planning phase).

**Code Generation Service:** An abstraction layer that routes code tasks to the appropriate backend — Direct Apply (simple edits), Claude API, Cursor Cloud Agents, Codex, Claude Code, or OpenClaw (on-prem). Routes based on complexity, cost, latency, and which tools the user has connected. If no code gen tool is connected, falls back to direct LLM API code generation.

**Internet Resource Management:** GitHub (repos, PRs, CI/CD), Vercel (deployments, domains), email accounts, domain registrars, Stripe (payments), marketing tools, CRM, analytics, and any other service the user connects.

**Knowledge Base Manager:** Reads, writes, and maintains the 3-tier knowledge base. Auto-extracts from conversations, integrations, and research. Enforces size limits and structure.

**Voice Interface:** Dual-provider setup — Vapi for full conversational AI, Deepgram for speech-to-text/TTS.

**Research Tools:** Web search, competitor analysis, market research, document analysis.
