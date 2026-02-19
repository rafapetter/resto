# ATR Resto — AI Co-Founder Platform

> Your AI co-founder that handles all the rest.

**Website:** [alltherest.world](https://www.alltherest.world/) · **Live app:** [resto-eight-kappa.vercel.app](https://resto-eight-kappa.vercel.app)

---

## Overview

ATR Resto is a cloud-based SaaS platform that gives non-technical entrepreneurs an AI co-founder named **Resto**. Resto manages the entire business lifecycle — from idea validation to a deployed, revenue-generating application — through natural chat and voice conversation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (Turbopack), React 19, TypeScript 5 (strict) |
| Styling | Tailwind CSS v4, shadcn/ui (new-york, zinc) |
| Backend | tRPC v11, TanStack Query, SuperJSON |
| Orchestration | CopilotKit 1.51 (AG-UI protocol) |
| Database | Neon PostgreSQL, Drizzle ORM, pgvector |
| Cache / Storage | Vercel KV + Vercel Blob |
| Auth | Clerk (multi-tenant) |
| AI Models | Claude Opus/Sonnet/Haiku, Gemini Flash |
| Embeddings | OpenAI text-embedding-3-small (1536d) |
| Voice | Web Speech API (STT) + OpenAI TTS |
| Billing | Stripe (Checkout + Customer Portal) |
| Email | Resend + React Email |
| Analytics | PostHog (product analytics) + Sentry (error tracking) |
| Hosting | Vercel (auto-deploy from GitHub) |

---

## Features

### Core Platform
- **Multi-tenant architecture** — Clerk auth → tenant isolation enforced in tRPC middleware
- **LLM Router** — task-level model routing (Opus for critical, Sonnet for default, Haiku for simple, Gemini for multimodal)
- **Knowledge Base** — 3-tier system (index / summary / detail) with pgvector semantic search, stored in Vercel Blob
- **Autonomy System** — 6 categories × 5 approval levels, human-in-the-loop via CopilotKit `renderAndWait`

### Agent Capabilities
- **Chat interface** — full AG-UI protocol with streaming responses and action rendering
- **Voice interface** — hold-to-speak (Web Speech API) + TTS playback (OpenAI tts-1)
- **Code generation** — Claude Agent SDK headless codegen in temp directories
- **GitHub integration** — OAuth2, atomic multi-file push via Git Data API
- **Vercel deployment** — OAuth2, project creation + deployment trigger via REST API
- **Credential vault** — AES-256-GCM encryption with HKDF key derivation

### Business Features
- **Onboarding wizard** — 4-step: Template → Business Info → Autonomy → Review; 3-layer template drill-down (Industry → Vertical → Products)
- **Project checklist** — staged tasks (Plan / Build / Launch / Grow) with status tracking
- **Billing** — Free / Pro ($29/mo) / Scale ($99/mo) plans; usage gating on projects, tokens, KB storage, agent actions
- **Analytics dashboard** — cost by day/model/task, usage stats via recharts
- **Email notifications** — checklist complete, project milestones, autonomy decisions, weekly digest (Vercel Cron)

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Authenticated pages (projects, chat, billing, analytics)
│   ├── (auth)/               # Sign-in / sign-up
│   └── api/                  # Route handlers (copilotkit, voice, webhooks, cron)
├── components/
│   ├── agent/                # Chat UI, voice button, autonomy renderer
│   ├── layout/               # Sidebar, nav
│   ├── onboarding/           # 4-step wizard, template catalog, chip-select
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── agent/                # Prompts, actions, tasks, tools, bootstrap
│   ├── autonomy/             # Checker, action-middleware, audit
│   ├── billing/              # Plans, Stripe client, gating
│   ├── chat/                 # AG-UI ↔ DB message converter
│   ├── codegen/              # Claude Agent SDK codegen
│   ├── copilotkit/           # Routed adapter (Opus/Sonnet/Haiku routing)
│   ├── crypto/               # AES-256-GCM encryption
│   ├── email/                # Resend client, React Email templates, send helpers
│   ├── github/               # Git Data API client
│   ├── integrations/         # OAuth state, token refresh, provider registry
│   ├── knowledge/            # KB service, embeddings, blob storage, size enforcer
│   ├── llm/                  # Router, analyzer, providers, cost tracker, cache
│   └── vercel-deploy/        # Vercel REST API client
└── server/
    ├── db/schema/            # 12 Drizzle schema files
    └── trpc/routers/         # 11 tRPC routers
```

---

## Getting Started

### Prerequisites

- Node.js 20+, pnpm
- Accounts: Clerk, Neon, Vercel, Anthropic, OpenAI, Resend

### Local Setup

```bash
# Clone and install
git clone https://github.com/rafapetter/resto.git
cd resto
pnpm install

# Pull env vars from Vercel (requires vercel login)
npx vercel env pull .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Key variables (see `.env.example` for full list):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth |
| `CLERK_SECRET_KEY` | Clerk auth |
| `DATABASE_URL` | Neon PostgreSQL |
| `ANTHROPIC_API_KEY` | Claude models |
| `OPENAI_API_KEY` | Embeddings + TTS |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage |
| `RESEND_API_KEY` | Email notifications |
| `STRIPE_SECRET_KEY` | Billing |
| `NEXT_PUBLIC_APP_URL` | Deep links in emails |

### Testing

```bash
pnpm test          # 192 unit tests (Vitest)
pnpm test:e2e      # 46+ E2E tests (Playwright, needs .env.e2e)
npx tsc --noEmit   # TypeScript check
```

---

## Deployment

Auto-deploys to Vercel on push to `main`. Vercel Cron runs the weekly digest every Monday at 9am UTC.

```bash
# Manual production deploy
npx vercel --prod --yes
```

---

## Build Phases Completed

| Phase | Feature |
|-------|---------|
| 1–2 | Core infrastructure (DB, auth, tRPC, multi-tenancy) |
| 3 | Onboarding wizard (template catalog, business info, autonomy) |
| 4 | Integrations & credential vault (GitHub, Vercel, Stripe, Webhook) |
| 5 | Knowledge base (3-tier, pgvector embeddings, Vercel Blob) |
| 6 | Autonomy system (6 categories, HITL approval, audit log) |
| 7 | Code generation & deployment (Claude Agent SDK, GitHub API, Vercel API) |
| 8 | Chat persistence (AG-UI ↔ DB, message history) |
| 9 | LLM router (Opus/Sonnet/Haiku/Gemini routing by task) |
| 10 | Rate limiting & cost tracking |
| 11 | Unit testing (192 tests, Vitest) |
| 12 | E2E testing (46+ tests, Playwright) |
| 13 | Voice interface (Web Speech API STT + OpenAI TTS) |
| 14 | Analytics & monitoring (PostHog, Sentry, cost dashboard) |
| 15 | Billing & monetization (Stripe, Free/Pro/Scale plans, usage gating) |
| 16 | Email notifications (Resend, React Email, 4 event types + weekly digest) |

---

## License

Proprietary — All The Rest, Inc.
