# Agent Roles | v1.0.0 | 2026-02-03

Resto is ATR's AI co-founder agent. It operates as a single Master Agent with a hierarchical architecture using contextual task instances.

**Master Agent (Orchestrator):** Holds full project context — the user's vision, the business checklist, the knowledge base. It decides what needs to be done and in what order. It is the single entity the user converses with via chat or voice.

**Contextual Task Instances ("Sub-agents"):** The Master Agent spawns focused instances for specific tasks. Each instance receives curated context relevant to the task at hand (coding, research, DevOps, marketing, etc.). Instances are isolated threads — they don't pollute each other's context.

**Key principle:** Context is the differentiator, not separate models. The same underlying agent, given different context, becomes a specialist. As ATR scales, true specialized agents can replace instances without architectural changes.

**Default Persona:** "Resto" — branded, friendly, customizable. Users can rename and adjust personality traits to match their working style.
