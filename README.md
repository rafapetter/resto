# ATR Agents — All The Rest

> Your AI co-founder that handles all the rest.

## Overview

ATR is a cloud-based SaaS platform that provides non-technical entrepreneurs with an AI co-founder named **Resto**. Resto manages the entire business lifecycle — from idea validation to a deployed, revenue-generating application — through chat and voice conversation.

**Website:** [alltherest.world](https://www.alltherest.world/)

## What This Repository Contains

This repository houses the **knowledge base** and **platform source code** for the ATR Agents platform.

### Knowledge Base Structure

The knowledge base follows a 3-tier architecture designed for AI agent consumption:

```
knowledge-base/
├── 1-index/          # Master index (max 50 lines per file)
│   └── index.md      # All topics with references to summaries
│
├── 2-summaries/      # Topic summaries (max 2,000 chars per file)
│   ├── agent/        # Agent architecture, roles, tools, integrations
│   ├── organization/ # Mission, strategy, structure, ecosystem
│   ├── product/      # Specs, tech stack, onboarding, features
│   ├── ai/           # Models, voice, orchestration, code generation
│   ├── documentation/# Q&A decisions, research
│   ├── prompts/      # Onboarding, task execution, validation
│   ├── gtm/          # ICP, training, ecosystem pipeline
│   ├── unit-economics/# Pricing model, credit system
│   ├── critical-review/# Red team, risk analysis
│   ├── security/     # Credentials, compliance
│   ├── competitive/  # Market positioning
│   ├── metrics/      # KPIs, success criteria
│   ├── user/         # Preferences, persona
│   ├── fundraising/  # Pitch materials
│   ├── models/       # LLM routing rules
│   └── 3rd-parties/  # External integrations
│
├── 3-descriptions/   # Detailed specs (max 50,000 chars per file)
│   ├── agent/        # Architecture, code gen service, integrations
│   ├── organization/ # Ecosystem detail
│   ├── product/      # Platform spec, tech stack, onboarding, KB system
│   ├── ai/           # LLM routing, voice providers
│   ├── gtm/          # Workshop curriculum
│   └── security/     # Credential architecture
│
└── assets/           # Non-MD files (PDFs, images, media)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes, tRPC |
| Orchestration | CopilotKit (AG-UI protocol) |
| Database | Neon PostgreSQL (Vercel), pgvector |
| Cache | Vercel KV (Redis) |
| Storage | Vercel Blob |
| Auth | Clerk |
| AI | Claude (Opus/Sonnet/Haiku), Gemini (3.0/Flash) |
| Voice | Vapi, Deepgram |
| Hosting | Vercel |

## Core Concept

ATR is **not** a code generator or UI builder. It's a **business operator** that happens to also write code.

Resto can:
- Plan your business strategy
- Research your market
- Write and deploy your application
- Manage your domains, payments, and marketing
- Prepare investor pitches
- Run ongoing operations

All through natural conversation — text or voice.

## Getting Started

*Platform source code coming soon. Currently in planning and specification phase.*

## License

Proprietary — All The Rest, Inc.
