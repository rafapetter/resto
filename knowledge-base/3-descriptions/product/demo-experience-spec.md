# Interactive Demo Experience Spec | v2.0.0 | 2026-02-24

## Status: IMPLEMENTED

All features below are implemented and live in `resto/src/app/demo/`.

## Overview

The Resto demo is an interactive, cinematic experience that takes prospects from zero to a fully deployed production app in ~12 minutes. It differentiates audiences with a Matrix-themed "red pill / blue pill" entry, offers split-screen tech vs. abstraction views, and uses pixel-art agent visualization with gamification to make the experience unforgettable.

## Architecture

### ViewMode System

Every phase component receives a `viewMode` prop:

- **`magic`** (Blue Pill): Business outcomes, visual progress, plain English. No code, no jargon.
- **`tech`** (Red Pill): Code generation, terminal commands, architecture diagrams, deployment pipelines.
- **`split`** (See Both): Side-by-side layout. Left = magic, right = tech. Synced progression.

Toggle between modes at any time via the header buttons.

### Phase Flow (10 phases)

1. **Matrix Entry** — Full-screen choice screen (not counted in stepper)
2. **Onboarding (Setup)** — Autonomy preferences + project genesis animation
3. **Dashboard** — Project overview with apps, tools, and "Buy a Domain" option
4. **Integrations** — Third-party connections setup
5. **Chat** — Conversational AI demo → auto-cycles through WhatsApp, Telegram, Slack, Email with simulated conversations
6. **Voice** — Voice interaction demo (Web Speech API) → auto-cycles through Phone Call, Team Meeting
7. **Build** — Code editor + terminal simulation (magic/tech/split views)
8. **Knowledge** — Knowledge base construction
9. **Analytics** — Agent team visualization + metrics
10. **Deploy** — Infrastructure checklist / terminal output (magic/tech/split views)
11. **Operations (Day 2+)** — Comparison table ("Old way vs Resto") + CTA

Note: Channels phase was removed — multi-channel is now demonstrated within Chat and Voice phases via auto-cycling animations.

### Persistent Layers (visible across all phases)

- **Narrative Timeline**: Dual progress bar — "Traditional: 6 months, $180K" vs "Resto: 12 min, $0". Updates per phase.
- **Pixel Agent Bar**: Collapsible bottom bar with animated pixel characters, color-coded task labels per phase.
- **Gamification HUD**: XP counter with levels, achievement toasts, combo multiplier. Includes explanatory tooltip on first achievement.

## Implemented Components

### 1. Matrix Entry Screen (`matrix-entry.tsx`)

- Canvas-based digital rain (emerald green + katakana on black)
- Radial vignette darkening behind content for readability
- Pixel Morpheus character (bald, sunglasses with green glint, dark suit, holding pills)
- Two glowing pill buttons: Blue "See the Magic" / Red "See How It's Built"
- Hover reveals preview tooltip describing each path
- "See Both Paths" link below for split mode
- Selection triggers fade-out transition into onboarding
- Staggered entrance animations (title → Morpheus → pills → link)

### 2. Chat Phase (`chat-phase.tsx`)

- Initial Resto chat conversation with typewriter animation and action approval cards
- After conversation completes, auto-cycles through channels:
  - **WhatsApp**: Dark themed (#0b141a), green accents, simulated conversation about daily briefing
  - **Telegram**: Dark themed (#0e1621), blue accents, simulated /status and /deploy commands
  - **Slack**: Dark themed (#1a1d21), purple accents, simulated #channel standup
  - **Email**: Dark themed, rose accents, simulated weekly report exchange
- Each channel shows full animated conversation with typing indicators
- Transition overlay with channel icon when switching ("Switching to WhatsApp...")
- 5-second dwell per channel, 500ms transition

### 3. Voice Phase (`voice-phase.tsx`)

- Waveform visualizer with voice transcript (typewriter for both user/agent lines)
- Web Speech API integration for audio playback (default: silent, click to enable)
- Prominent "Turn on audio to hear Resto speak" button when audio is off
- After transcript, auto-cycles through:
  - **Phone Call**: Calling card UI with hotline, languages, 24/7 availability
  - **Team Meeting**: 4-participant grid (You, Resto, Sarah, Tom) with waveforms, auto-captured actions
- Transition overlay matching chat timing (~4s dwell, 500ms transition)

### 4. Build Phase (`build-phase.tsx`)

- **Magic mode**: Visual builder with progress ring, feature names completing, live preview
- **Tech mode**: Syntax-highlighted code editor with TypeScript being typed + terminal running commands
- **Split mode**: Left = magic, Right = tech, synced progress

### 5. Deploy Phase (`deploy-phase.tsx`)

- **Magic mode**: Infrastructure checklist items appearing with checkmarks
- **Tech mode**: Terminal simulation with deploy commands and output
- **Split mode**: Side-by-side checklist + terminal

### 6. Dashboard Phase (`dashboard-phase.tsx`)

- Project overview with Apps & Products section (Web App, Mobile App, Admin Panel)
- "Buy a Domain" card with search bar, domain availability badge
- Project Tools section

### 7. Operations Phase (`operations-phase.tsx`)

- Directly shows comparison table: "The old way vs Resto"
- 6 animated rows: Time to launch, Cost, Team, Availability, Maintenance, GTM
- Each row slides in sequentially (400ms stagger)
- After all rows visible, CTA section fades in:
  - "Ready to build your product?" heading
  - Final metrics (Revenue, Customers, Uptime, Time to Market)
  - "Start Building with Resto" + "Explore More Use Cases" buttons
- Full-page scrollable (no timeline events — skips straight to comparison)

### 8. Pixel Agent Bar (`pixel-agent-bar.tsx`)

- Collapsible bottom bar with animated 24×24 pixel characters
- Characters have idle animations (breathing, blinking)
- Color-coded task labels change per phase
- "9 agents active" toggle button

### 9. Gamification HUD (`gamification-hud.tsx`)

- Top-right XP counter with level badges (Starter → Apprentice → Builder → ...)
- Achievement toasts per phase: Genesis, Command Center, Plugged In, First Conversation, Voice Activated, 100 Files Generated, Knowledge Loaded, Team Assembled, Ship It!, Never Sleeps
- Combo multiplier animation
- Help icon with tooltip explaining the XP system ("Demo Progress Tracker")

### 10. Narrative Timeline (`narrative-timeline.tsx`)

- Persistent bar below header
- Two progress tracks with phase-by-phase data
- Animated counters for time saved and cost saved
- Green pulse on Resto milestones

## Content Structure

Each use case content file provides data for all phases:

```typescript
type UseCaseDemoContent = {
  onboarding: OnboardingContent;
  dashboard: DashboardContent;
  integrations: IntegrationsContent;
  chat: ChatContent;
  voice: VoiceContent;
  build: BuildContent;
  knowledge: KnowledgeContent;
  analytics: AnalyticsContent;
  deploy: DeployContent;
  operations: OperationsContent;
  techOverlay?: {
    build?: { codeSnippets: CodeSnippet[]; terminalCommands: TerminalCommand[] };
    deploy?: { terminalCommands: TerminalCommand[] };
  };
};
```

10 industry verticals implemented: E-Commerce, SaaS, Healthcare, Education, Real Estate, Restaurant, Fitness, Legal, Finance, Logistics.

## Key Files

| File | Purpose |
|------|---------|
| `matrix-entry.tsx` | Matrix entry screen with pills + Morpheus |
| `demo-player-shell.tsx` | Main orchestrator — phase routing, view mode, persistent layers |
| `demo-header-v2.tsx` | Phase stepper + view mode toggle |
| `phases-v2/*.tsx` | Individual phase components |
| `shared/gamification-hud.tsx` | XP + achievements |
| `shared/narrative-timeline.tsx` | Dual progress bar |
| `shared/pixel-agent-bar.tsx` | Pixel agent visualization |
| `lib/demo/types.ts` | All TypeScript types |
| `lib/demo/phases.ts` | Phase definitions (10 phases) |
| `lib/demo/content/*.ts` | Content per industry vertical |

## References

- pixel-agents (pablodelucca/pixel-agents) — VS Code pixel office for AI agents
- Claude Quest — pixel RPG companion for Claude Code sessions
- WhatIsTheMatrix.com — Warner Bros red/blue pill choice UX
- Navattic — branching demo logic, top 1% = 56% engagement
