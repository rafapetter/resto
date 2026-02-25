# Resto — Agent Instructions

## Commands

```bash
pnpm install              # Install dependencies
pnpm dev                  # Dev server (port 3001, Turbopack)
pnpm build                # Production build
pnpm lint                 # Lint
pnpm format               # Format with Prettier
pnpm test                 # Unit tests (Vitest)
pnpm test:watch           # Unit tests (watch)
pnpm test:coverage        # Unit tests with coverage
pnpm test:e2e             # E2E tests (Playwright)
pnpm db:generate          # Generate Drizzle migrations
pnpm db:migrate           # Run migrations
pnpm db:push              # Push schema to DB
pnpm db:studio            # Database GUI
pnpm db:seed              # Seed database
```

## Structure

- `src/app/` — Next.js App Router pages
- `src/components/` — React components (shadcn/ui)
- `src/server/db/` — Drizzle schema, migrations, seed
- `src/trpc/` — tRPC router and procedures
- `src/lib/` — Utilities
- `src/types/` — Type definitions
- `e2e/` — Playwright tests

## Conventions

- Package manager: **pnpm** (not npm)
- `@/` import alias → `src/`
- tRPC v11 for all data fetching — validated with Zod
- Drizzle ORM for database — Neon PostgreSQL + pgvector
- Multi-tenancy: `tenant_id` on every DB table, always filter by it
- Server Components by default; `"use client"` only when needed
- Run `pnpm test` before committing business logic changes
