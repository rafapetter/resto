# Onboarding Flow — Detailed Design | v1.0.0 | 2026-02-03

## Overview

ATR's onboarding is a three-phase progressive disclosure flow: Template Gallery → Guided Wizard → Conversational Deep-Dive. Designed for non-technical users who need structure before open-ended conversation.

## Phase 1: Template Gallery (Orient)

### Purpose
Ground the user in what's possible. Reduce "blank page" anxiety. Spark ideas.

### Experience
1. User lands on template gallery after sign-up
2. Templates organized by business type:
   - **SaaS**: CRM, project management, analytics dashboard, booking system, internal tool
   - **E-commerce**: Product store, subscription box, digital goods, print-on-demand
   - **Marketplace**: Service marketplace, freelance platform, rental marketplace
3. Each template shows:
   - Preview screenshot/mockup
   - Key features included
   - Estimated build time
   - Tech stack used
4. User selects a template (or "Start from scratch")
5. Selection informs but doesn't lock — it's a starting point

### Templates Needed for V1
- SaaS: Analytics Dashboard
- SaaS: Booking/Scheduling System
- E-commerce: Product Store with Stripe
- E-commerce: Digital Downloads
- Marketplace: Service Marketplace
- Blank: Start from scratch

## Phase 2: Guided Wizard (Structure)

### Purpose
Efficiently capture structured data about the business. Faster than conversation for known-format questions.

### Steps

**Step 2.1 — Business Basics**
- Business name
- Application type: Web / Mobile / Both
- Industry (dropdown + custom)
- One-sentence problem statement
- One-sentence solution

**Step 2.2 — Target Customer**
- Who is your customer? (free text)
- B2B or B2C or Both?
- Geographic focus

**Step 2.3 — Revenue Model**
- How will you make money? (checkboxes: subscription, one-time, freemium, marketplace fee, advertising, other)
- Pricing range (if known)

**Step 2.4 — Account Connections**
- GitHub account (for code repository)
- Vercel account (for hosting)
- Email account (for communications)
- Payment provider (Stripe recommended)
- Code generation tool (Cursor Cloud / Claude Code / Codex — optional but recommended)
- Domain registrar (optional at this stage)

**Step 2.5 — Autonomy Preferences**
- For each action category, set: Auto-approve / Quick confirm / Explicit approval
  - Research and planning
  - Code changes
  - Deployments
  - Spending money
  - External communications (emails, etc.)
  - Account modifications

### UX Notes
- Progress bar showing completion
- "Skip for now" on optional steps
- Resto provides contextual tips at each step
- Data saved progressively (user can leave and return)

## Phase 3: Conversational Deep-Dive (Personalize)

### Purpose
Resto takes over as the AI co-founder. Asks nuanced, adaptive questions to understand the full vision. This is where the real depth emerges.

### Conversation Flow

Resto uses a guided conversation framework (not rigid, but structured):

**Block 1 — Vision Expansion**
- Tell me more about why you want to build this
- What inspired this idea?
- What does success look like in 1 year?

**Block 2 — Market Understanding**
- Who are your competitors?
- What makes your approach different?
- Have you talked to potential customers?

**Block 3 — Feature Prioritization**
- Of the features we discussed, which 3 are must-haves for launch?
- What can wait for v2?
- Any specific integrations required?

**Block 4 — GTM Strategy**
- How will your first 10 customers find you?
- What's your marketing budget?
- Do you have existing audience/network?

**Block 5 — Technical Decisions**
- Review recommended tech stack
- Any specific requirements (compliance, scale, region)?
- Confirm connected tools are sufficient

**Block 6 — Risk Discussion**
- What could go wrong?
- What are you most uncertain about?
- Biggest assumption to validate?

### Adaptive Behavior
- If user gives short answers, Resto probes deeper
- If user is verbose, Resto summarizes and confirms
- Skips topics already well-covered in wizard
- Adjusts complexity of language to user's apparent technical level

## Output: Business Plan + Checklist

After Phase 3, Resto generates:

1. **Business Plan Document** (stored in knowledge base)
   - Executive summary
   - Problem & solution
   - Target market & ICP
   - Revenue model
   - Feature list (prioritized)
   - Tech stack confirmation
   - GTM strategy outline
   - Risk register

2. **Persistent Checklist** (visible in UI at all times)
   - Discovery & Planning ✓
   - Market Validation
   - Foundation Setup
   - Core Build
   - Quality & Testing
   - GTM Preparation
   - Launch
   - Post-Launch Operations

3. **Knowledge Base Initialization**
   - All 3 tiers populated with planning outputs
   - Ready for ongoing agent use

User reviews the plan and checklist, provides feedback, and approves to begin execution.
