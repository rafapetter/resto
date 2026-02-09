# Tech Stack | v1.0.0 | 2026-02-03

All-TypeScript, Vercel-native architecture. No Python layer — full stack consistency.

**Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS + shadcn/ui, CopilotKit for agent-UI integration.

**Backend:** Next.js API Routes + tRPC (type-safe), CopilotKit orchestration, Vercel AI SDK for streaming.

**Database:** Neon PostgreSQL (via Vercel) for primary data, pgvector for semantic search/knowledge retrieval, Vercel KV (Redis) for cache/pub-sub/real-time.

**File Storage:** Vercel Blob for all file assets (knowledge base MDs, uploads, exports).

**Auth:** Clerk — multi-tenant ready, beautiful UI, fast integration.

**AI Orchestration:** CopilotKit — agent-native apps, Generative UI, human-in-the-loop, AG-UI protocol. Integrates with LangGraph for stateful agent workflows.

**Hosting:** Vercel for everything — frontend, backend, edge functions, storage.

**Voice:** Vapi (conversational AI platform) + Deepgram (low-latency STT/TTS).
