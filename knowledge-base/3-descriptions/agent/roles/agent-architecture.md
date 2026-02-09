# Agent Architecture — Detailed Design | v1.0.0 | 2026-02-03

## Overview

Resto is ATR's AI co-founder agent. It operates as a hierarchical system with a single Master Agent that spawns contextual task instances for focused execution.

## Master Agent (Orchestrator)

The Master Agent is the brain of the system. It:

1. **Holds full project context**: The user's vision, business model, current state of the checklist, knowledge base index, connected accounts, and conversation history.
2. **Understands intent**: Interprets user requests (via chat or voice) and determines the right course of action.
3. **Plans execution**: Breaks complex requests into ordered tasks.
4. **Delegates to instances**: Spawns contextual task instances with curated context for each specific task.
5. **Synthesizes results**: Collects outputs from task instances, validates quality, and presents results to the user.
6. **Maintains knowledge**: Updates the 3-tier knowledge base after every significant action.

### Master Agent Context Window

The Master Agent always has access to:
- 1st Tier Index (all topic references)
- Current checklist state
- User preferences and autonomy settings
- Connected accounts registry (what's available)
- Recent conversation history
- Active tasks and their status

It does NOT load full 3rd tier descriptions into its context unless specifically needed for a task.

## Contextual Task Instances ("Sub-agents")

When the Master Agent identifies a task to execute, it spawns a focused instance:

### Instance Creation Flow
1. Master Agent identifies the task type (coding, research, DevOps, marketing, etc.)
2. Curates a context package from the knowledge base:
   - Relevant 2nd tier summaries
   - Specific 3rd tier descriptions needed
   - Connected account credentials for the task
   - User preferences and autonomy levels
3. Spawns the instance with the curated context
4. Instance executes autonomously within its scope
5. Returns results to Master Agent
6. Master Agent validates and presents to user

### Context Packages by Task Type

**Coding Instance:**
- Tech stack specification
- Relevant source code files
- Data model / schema
- Feature requirements from checklist
- Connected code gen tool credentials

**Research Instance:**
- Market context and competitor info
- Research goals and questions
- Previous research findings
- Web search tool access

**DevOps Instance:**
- Infrastructure configuration
- Deployment status and history
- Connected hosting credentials (Vercel, etc.)
- Domain and DNS configuration

**GTM/Marketing Instance:**
- ICP definition
- Marketing channel access (email, social)
- Content strategy and brand guidelines
- Analytics data

**Finance/Planning Instance:**
- Business model and pricing
- Unit economics
- Financial projections
- Connected finance tools

## Thread Isolation

Each instance runs in its own thread:
- No context pollution between tasks
- Parallel execution possible for independent tasks
- Each instance's output is captured and logged
- Failed instances don't affect other running tasks

## Scaling Path

The current architecture (single agent, contextual instances) is designed to evolve:

**Phase 1 (V1):** Single Master Agent + contextual instances. Same underlying model, different context.

**Phase 2:** Introduce specialized system prompts per instance type. The coding instance gets a developer-optimized prompt, the marketing instance gets a marketer-optimized prompt.

**Phase 3:** True specialized agents. Different models or fine-tuned versions for different task types. The architecture supports this without changes — the routing just switches from "same model, different context" to "different model, different context."

## CopilotKit Integration

The Master Agent integrates with CopilotKit for:
- **Chat UI**: Streaming responses, tool call visualization, agent state display
- **Generative UI**: Rendering dynamic React components based on agent output (charts, forms, previews)
- **Shared State**: Real-time synchronization between agent state and UI
- **Human-in-the-Loop**: Pausing execution for user confirmation, presenting options, collecting input
- **AG-UI Protocol**: Standardized agent-user communication channel

## Persona System

### Default Persona — Resto
- Friendly, professional, proactive
- Uses the user's name
- Celebrates wins ("Your app is live!")
- Transparent about uncertainty ("I'm 80% confident this will work, should I proceed?")
- Adapts to interaction mode (shorter in voice, detailed in text)

### Customization
Users can modify:
- Agent name (default: Resto)
- Formality level (1-5 scale)
- Risk tolerance (cautious ↔ bold)
- Communication density (concise ↔ detailed)
- Proactivity (wait for instructions ↔ suggest next steps)

Settings stored in user preferences table, loaded into every agent instance context.
