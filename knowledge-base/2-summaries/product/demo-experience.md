# Demo Experience | v2.0.0 | 2026-02-24

## Status: IMPLEMENTED

Interactive product demos live at `resto.alltherest.world/demo/{use-case}` for 10 industry verticals.

## Flow

Matrix entry screen (red/blue pill choice) → 10-phase interactive walkthrough → comparison + CTA.

**View modes**: Magic (business outcomes), Tech (code/terminal), Split (both side-by-side). Togglable anytime.

## 10 Phases

Setup → Dashboard → Integrations → Chat → Voice → Build → Knowledge → Analytics → Deploy → Day 2+

## Key Features

- **Matrix Entry**: Digital rain, pixel Morpheus, blue/red pill buttons
- **Chat**: Simulated conversations auto-cycling through Resto → WhatsApp → Telegram → Slack → Email
- **Voice**: Web Speech API playback, auto-cycling through App → Phone → Team Meeting
- **Build/Deploy**: Magic vs Tech views with code editor + terminal simulations
- **Day 2+**: "Old way vs Resto" comparison table + CTA (no timeline events)
- **Gamification**: XP, levels, achievement toasts, combo multiplier
- **Narrative Timeline**: "Traditional: 6mo/$180K" vs "Resto: 12min/$0"
- **Pixel Agent Bar**: Animated characters with phase-aware tasks

## Implementation

All in `resto/src/app/demo/`. See [3-descriptions/product/demo-experience-spec.md](../../3-descriptions/product/demo-experience-spec.md) for full spec.
