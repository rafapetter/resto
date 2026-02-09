# AI Orchestration | v1.0.0 | 2026-02-03

ATR uses a hybrid orchestration approach: CopilotKit for agent-UI integration and custom logic for business orchestration.

**CopilotKit (Primary Framework):**
- Agent-native application framework
- Generative UI — agents render React components dynamically
- Shared state between agents and UI in real-time
- Human-in-the-loop patterns (pause, confirm, edit before continuing)
- AG-UI protocol for standardized agent-user communication
- TypeScript-first, React-native integration

**Custom Orchestration Layer:**
- Business logic routing (which tasks to execute, in what order)
- Knowledge base management (auto-extraction, structuring, retrieval)
- Credential management and secure tool invocation
- LLM routing (selecting the right model per task)
- Autonomy level enforcement (checking user permissions before executing)

**Architecture:** CopilotKit handles the agent-UI communication channel. Custom logic sits between CopilotKit and the actual tool execution, managing context, permissions, and knowledge.

**Cloud vs On-Premise:**
- Cloud: CopilotKit + Claude API + Cursor Cloud Agents
- On-Premise: OpenClaw (to be evaluated as alternative)
