# Full Tech Stack — Detailed Specification | v1.0.0 | 2026-02-03

## Guiding Principles

1. **All-TypeScript**: One language across the entire stack. No Python layer.
2. **Vercel-Native**: Maximize use of Vercel ecosystem for hosting, storage, and databases.
3. **CopilotKit-Powered**: Agent-UI integration through CopilotKit framework.
4. **Provider-Agnostic AI**: Abstract LLM providers behind a routing layer.
5. **Testable & Validated**: Every layer designed for automated testing.

## Frontend

### Next.js 14+ (App Router)
- React Server Components for performance
- Server Actions for mutations
- Streaming for real-time agent responses
- Edge runtime where latency matters
- App Router for nested layouts (chat, dashboard, settings)

### TypeScript (Strict Mode)
- Full type safety across frontend and backend
- Shared types via tRPC
- Zod for runtime validation

### Tailwind CSS + shadcn/ui
- Utility-first CSS
- shadcn/ui for accessible, beautiful components (owned, not dependency)
- Dark mode support
- Responsive design (mobile-first for voice users)

### CopilotKit (Frontend)
- `<CopilotChat />` component for the chat interface
- `useAgent` hook for agent state management
- Generative UI rendering (agent returns React components)
- Shared state synchronization
- Human-in-the-loop UI patterns

### State Management
- Zustand for lightweight local state (UI preferences, modal state)
- TanStack Query for server state caching and synchronization
- CopilotKit shared state for agent-UI real-time sync

## Backend

### Next.js API Routes + tRPC
- Type-safe API layer
- End-to-end TypeScript types (frontend ↔ backend)
- Automatic input validation
- Middleware for auth, rate limiting, tenant isolation

### CopilotKit (Backend)
- Agent runtime execution
- Tool definitions and execution
- LangGraph integration for stateful workflows
- AG-UI protocol server

### Vercel AI SDK
- Streaming responses from LLMs
- Tool calling abstraction
- Multi-provider support (Anthropic, Google)

### Background Jobs
- Vercel Cron Jobs for scheduled tasks
- Vercel Edge Functions for lightweight processing
- For heavy async work: consider Inngest or Trigger.dev (TypeScript-native job queues)

## Database

### Neon PostgreSQL (via Vercel)
- Primary data store
- Serverless Postgres (scales to zero, auto-scales up)
- Connection pooling built-in
- Branching for development/staging

### Schema Design Principles
- Tenant ID on every table
- UUID primary keys
- TIMESTAMPTZ for all dates
- JSONB for flexible/evolving fields
- Indexes on tenant_id + common query patterns

### pgvector (in Neon)
- Vector embeddings for knowledge base semantic search
- Enables: "find relevant context for this task" queries
- Embedding model: text-embedding-3-small (OpenAI) or equivalent

### Vercel KV (Redis)
- Session management
- Real-time pub/sub (agent status, task progress)
- Caching (LLM responses, frequently accessed data)
- Rate limiting counters

## File Storage

### Vercel Blob
- Knowledge base MD files
- User-uploaded assets (documents, images, media)
- Generated exports (code archives, reports)
- Organized by tenant ID / project ID

## Authentication

### Clerk
- Multi-tenant authentication
- Email, Google, GitHub sign-in
- Organization/team support (future)
- Session management
- Middleware integration with Next.js
- Beautiful pre-built UI components

## AI Layer

### LLM Router
```typescript
interface LLMRouter {
  route(task: TaskDescription): {
    provider: 'anthropic' | 'google';
    model: string;
    estimatedCost: number;
    estimatedLatency: number;
  };
}
```

### Providers
- **Anthropic**: Claude Opus (complex), Sonnet (standard), Haiku (simple)
- **Google**: Gemini 3.0 (complex), Flash (simple)

### Voice Layer
- **Vapi**: Full voice agent conversations (inbound/outbound)
- **Deepgram**: STT transcription, TTS output, voice input processing

## Infrastructure

### Vercel
- Frontend hosting (Edge Network, global CDN)
- Backend hosting (Serverless Functions, Edge Functions)
- Database (Neon Postgres)
- Cache (KV / Redis)
- Storage (Blob)
- Cron jobs
- Analytics (Vercel Analytics)
- Monitoring (Vercel Logs)

### Domain & DNS
- Vercel Domains for platform (alltherest.world)
- Customer domains managed through Vercel or their domain registrar

## Development Tools

### Package Manager: pnpm
### Monorepo: Turborepo (if needed for shared packages)
### Linting: ESLint + Prettier
### Testing: Vitest (unit), Playwright (e2e)
### CI/CD: Vercel Git Integration (auto-deploy on push)
### Version Control: GitHub
