# Resto — Claude Context

## What This Is

Core AI co-founder platform. Users interact with Resto (the AI agent) via chat and voice to build and run their businesses.

## Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Dev server on port 3001 (Turbopack)
pnpm build                # Production build
pnpm lint                 # ESLint
pnpm format               # Prettier
pnpm test                 # Vitest (run once)
pnpm test:watch           # Vitest (watch mode)
pnpm test:coverage        # Vitest with coverage
pnpm test:e2e             # Playwright E2E tests
pnpm test:e2e:ui          # Playwright with UI
pnpm db:generate          # Generate Drizzle migrations
pnpm db:migrate           # Run Drizzle migrations
pnpm db:push              # Push schema to DB (dev)
pnpm db:studio            # Drizzle Studio GUI
pnpm db:seed              # Seed database
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── components/           # React components (shadcn/ui based)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
├── server/               # Server-side code
│   └── db/               # Drizzle schema, migrations, seed
├── trpc/                 # tRPC router and procedures
└── types/                # TypeScript type definitions
e2e/                      # Playwright E2E tests
knowledge-base/           # Mirror of root KB (synced periodically)
```

## Tech Stack

- **Next.js 16** with Turbopack (App Router)
- **React 19**, TypeScript strict
- **tRPC v11** — type-safe API (all data fetching goes through tRPC)
- **Drizzle ORM** — database (Neon PostgreSQL + pgvector)
- **CopilotKit 1.51** — agent-UI orchestration (AG-UI protocol)
- **Clerk** — auth (multi-tenant, `tenant_id` on every DB row)
- **Stripe** — billing and subscriptions
- **Tailwind CSS v4 + shadcn/ui** — styling
- **Sentry** — error tracking

## Key Conventions

- `@/` import alias maps to `src/`
- Server Components by default; `"use client"` only when needed
- All tRPC inputs validated with Zod schemas
- Multi-tenancy: every DB table has `tenant_id`, always filter by it
- Credentials: AES-256-GCM encrypted, decrypted only at moment of use
- LLM routing: cheapest model that handles the task (Haiku → Sonnet → Opus)
- Agent architecture: hierarchical (Master Agent spawns task instances)

## Testing

- Unit tests next to source files or in `__tests__/` directories
- E2E tests in `e2e/` directory, uses `.env.e2e` environment
- Run `pnpm test` before committing changes to business logic
