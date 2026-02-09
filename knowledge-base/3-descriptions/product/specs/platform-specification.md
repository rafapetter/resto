# ATR Platform Specification — Full Detail | v1.0.0 | 2026-02-03

## Product Identity

**Name:** ATR (All The Rest)
**Agent Name:** Resto
**Website:** https://www.alltherest.world
**Type:** Cloud-based AI co-founder SaaS platform
**Tagline:** "Your AI co-founder that handles all the rest."

## What ATR Is

ATR is a cloud-based platform that provides every entrepreneur — especially non-technical ones — with an AI co-founder named Resto. Resto can access and operate any internet resource on behalf of the entrepreneur, managing the entire business lifecycle from idea validation to a running, revenue-generating business.

## What ATR Is NOT

- Not a code generator (though it generates code)
- Not a UI builder (though it builds UIs)
- Not a traditional SaaS platform with a visual editor
- Not just for developers

ATR is a **business operator** that happens to also write code.

## Core Capabilities

### 1. Chat & Voice-First Interaction
- Primary interface is conversation (text or voice)
- Everything achievable via dashboard is achievable via chat/voice
- Dashboard is a complementary monitoring view, not the core experience
- Voice powered by Vapi (conversational AI) + Deepgram (STT/TTS)

### 2. Full Business Lifecycle Management
- Idea validation and market research
- Business planning and documentation
- Product specification and architecture
- Code generation and implementation
- Testing and quality assurance
- Deployment and DevOps
- GTM strategy and marketing execution
- Financial planning and tracking
- Investor pitch preparation
- Ongoing operations and scaling

### 3. Real Account Management
- Customer-owned accounts, agent-operated
- Connected via OAuth/API keys during planning phase
- Transparent operation (user can see what agent is doing)
- Full audit trail

### 4. Self-Maintaining Knowledge Base
- 3-tier structure (Index → Summaries → Descriptions)
- Auto-generated from conversations, integrations, and research
- Size limits enforced (50 lines / 2000 chars / 50000 chars per tier)
- Version tracked, change logged
- Users can review/edit but rarely need to

### 5. Persistent Checklist
- Visible throughout entire journey
- Steps from Plan to Deployed
- Dual-purpose: user oversight + agent task guidance
- Dynamic: adapts to business type
- Ties directly to agent task execution

### 6. Code Generation Abstraction
- Routes to: Direct Apply, LLM APIs, User's Code Gen Tools, OpenClaw
- User connects their own tools (Cursor Cloud, Claude Code, Codex)
- Smart routing based on complexity, cost, availability
- If no tool connected, falls back to LLM API generation

### 7. Configurable Autonomy
- User sets permissions per action category
- Progressive: start cautious, expand toward full autonomy
- Categories: research, code, deployments, spending, communications
- Goal state: full autonomy with guardrails

## User Experience Flow

### Step 1: Sign Up
- Clerk authentication (email, Google, GitHub)
- Account creation, plan selection

### Step 2: Onboarding — Template Gallery
- Browse SaaS, e-commerce, marketplace templates
- Select a starting point for inspiration

### Step 3: Onboarding — Guided Wizard
- Application type, industry, problem, solution
- Connect third-party accounts
- Connect code generation tools
- Set autonomy preferences

### Step 4: Onboarding — Conversational Deep-Dive
- Resto asks nuanced questions (like a human co-founder would)
- Market research, GTM strategy, risk analysis, tech decisions
- Iterative Q&A to capture full vision

### Step 5: Plan Generation
- Comprehensive business plan
- Persistent checklist (Plan → Deployed)
- User reviews and approves

### Step 6: Execution
- Resto works through the checklist
- Actions within autonomy limits execute automatically
- Actions above limits presented for approval
- Progress visible in checklist at all times

### Step 7: Launch
- Deployment to production
- Domain configuration
- Monitoring setup
- Launch verification

### Step 8: Post-Launch Operations
- Analytics tracking
- User feedback collection
- Iteration planning
- Ongoing business operations

## Technical Architecture

### All-TypeScript Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes + tRPC
- **Orchestration**: CopilotKit (AG-UI protocol)
- **Database**: Neon PostgreSQL (Vercel), pgvector for semantic search
- **Cache**: Vercel KV (Redis)
- **Storage**: Vercel Blob
- **Auth**: Clerk
- **Hosting**: Vercel (everything)
- **Voice**: Vapi + Deepgram
- **AI**: Claude (Opus/Sonnet/Haiku) + Gemini (3.0/Flash) with smart router

### Data Model (High-Level)
- **Tenants**: Each customer is a tenant with isolated data
- **Projects**: Each business the tenant is building
- **Knowledge Base**: 3-tier MD files stored in Vercel Blob, metadata in Postgres
- **Credentials**: Encrypted integration credentials per tenant
- **Conversations**: Chat/voice history per tenant per project
- **Tasks**: Checklist items and their execution state
- **Audit Log**: Every agent action logged

### Multi-Tenancy
- Logical isolation (tenant ID on every row)
- Designed to evolve toward database/environment isolation for enterprise
- Customer owns all their data, code, and accounts
- Eject option: export full codebase, deploy anywhere

## Monetization

### Subscription Tiers
- Included quotas per tier: AI requests, voice minutes, storage, connected accounts
- Higher tiers: faster models, more quotas, priority execution

### Credits/Wallet
- Overages consumed from wallet
- Manual or auto-recharge
- Spending limits configurable
- Transparent cost attribution

### Premium Services
- 4-hour workshops: "Build your startup with an AI co-founder"
- 8-hour workshops: "Transform your operations with an AI Tech Leader/Orchestrator"
- Premium pricing

## Target Market

### Primary: Non-technical entrepreneurs
- Grand vision, curiosity, ambition
- Blocked by lack of technical co-founder
- Building SaaS (priority 1), E-commerce (priority 2), Marketplaces (priority 3)

### Secondary: Business executives
- Want to leverage AI in existing operations
- Decision-makers at SMBs

### Tertiary: Technical founders & hackers
- Want to move faster
- ATR hackathon participants converting to platform users
