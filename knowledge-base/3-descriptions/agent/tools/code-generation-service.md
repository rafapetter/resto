# Code Generation Service — Detailed Design | v1.0.0 | 2026-02-03

## Overview

The Code Generation Service is an abstraction layer that provides a unified interface for all code-related tasks. It routes to the optimal backend based on task complexity, user-connected tools, cost, and availability.

## Architecture

```
┌──────────────────────────────────────────────────┐
│              CODE GENERATION SERVICE              │
│         (Unified TypeScript Interface)            │
├──────────────────────────────────────────────────┤
│                 SMART ROUTER                      │
│   Inputs: task complexity, connected tools,       │
│           cost budget, latency requirement         │
└──────┬──────┬──────────┬──────────┬──────────────┘
       │      │          │          │
       ▼      ▼          ▼          ▼
  ┌────────┐┌──────┐┌──────────┐┌────────────┐
  │ Direct ││ LLM  ││ User's   ││  OpenClaw   │
  │ Apply  ││ API  ││ Code Gen ││ (on-prem)   │
  │        ││      ││ Tool     ││             │
  └────────┘└──────┘└──────────┘└────────────┘
```

## Backends

### 1. Direct Apply
- **What**: Agent modifies files directly using file system operations
- **When**: Config changes, small edits, typo fixes, dependency updates, README changes
- **Cost**: Zero (no LLM call needed for trivial changes)
- **Latency**: Instant
- **Quality**: High for simple changes, inappropriate for complex logic

### 2. LLM API (Fallback)
- **What**: Direct code generation via Claude API or Gemini API
- **When**: New components, moderate features, refactoring — when no user code gen tool is connected
- **Cost**: Standard LLM token pricing (routed through Model Router)
- **Latency**: Seconds
- **Quality**: Good for most tasks, may miss project-wide context

### 3. User's Connected Code Gen Tool
- **What**: Delegates to Cursor Cloud Agents, Claude Code, or Codex via their APIs
- **When**: Complex multi-file features, large refactors, new modules — user has connected tool
- **Cost**: Charged to user's own subscription with the tool
- **Latency**: Variable (depends on provider)
- **Quality**: Highest — these tools have full IDE intelligence, project context
- **Setup**: User connects during onboarding via OAuth/API key

### 4. OpenClaw (On-Premise)
- **What**: Open-source AI agent for code generation
- **When**: Self-hosted customer deployments where cloud APIs aren't available/desired
- **Cost**: Infrastructure only (user's own compute)
- **Latency**: Variable (depends on hardware)
- **Quality**: To be evaluated

## Smart Router Logic

```typescript
interface CodeTask {
  type: 'edit' | 'create' | 'refactor' | 'fix' | 'config';
  complexity: 'trivial' | 'simple' | 'moderate' | 'complex';
  files: number; // how many files affected
  description: string;
  context: string[]; // relevant file paths
}

function routeCodeTask(task: CodeTask, userTools: ConnectedTool[]): Backend {
  // Trivial changes: always direct
  if (task.complexity === 'trivial') return 'direct-apply';
  
  // Complex tasks: prefer user's connected tool
  if (task.complexity === 'complex' && userTools.length > 0) {
    return selectBestTool(userTools, task);
  }
  
  // Moderate tasks: user tool if available, else LLM API
  if (task.complexity === 'moderate') {
    return userTools.length > 0 
      ? selectBestTool(userTools, task) 
      : 'llm-api';
  }
  
  // Simple tasks: LLM API (fast enough, cost effective)
  return 'llm-api';
}
```

## Complexity Scoring

Tasks are scored on:
- **Scope**: Single line (1) → Single file (3) → Multi-file (7) → System-wide (10)
- **Logic**: Formatting (1) → Simple logic (3) → Business logic (7) → Architecture (10)
- **Dependencies**: No deps (1) → Known deps (3) → Complex integration (7) → New system (10)

Average score maps to complexity:
- 1-2: Trivial → Direct Apply
- 3-4: Simple → LLM API
- 5-7: Moderate → User tool preferred
- 8-10: Complex → User tool required

## Unified Interface

```typescript
interface CodeGenerationRequest {
  task: CodeTask;
  projectId: string;
  files: FileContext[];      // current file contents for context
  requirements: string;      // what to build/change
  testCriteria?: string;     // how to verify success
}

interface CodeGenerationResult {
  success: boolean;
  changes: FileChange[];     // files created/modified
  explanation: string;       // what was done and why
  testResults?: TestResult[];
  backend: string;           // which backend was used
  cost: number;              // token cost (0 for direct apply)
}
```

## Quality Assurance

Every code generation result goes through:
1. **Syntax check**: Does it parse?
2. **Type check**: TypeScript compilation passes?
3. **Test execution**: If tests exist, do they pass?
4. **Lint check**: Does it meet project standards?
5. **Review**: For high-risk changes, present diff to user before applying

## Future Enhancements

- Learning from user preferences (which backends produce code they accept vs reject)
- Caching common patterns to avoid redundant generation
- Multi-backend comparison (generate with 2 backends, pick the better result for critical code)
- Cost prediction before execution ("This will use ~$0.50 in credits, proceed?")
