# LLM Routing Strategy — Detailed Design | v1.0.0 | 2026-02-03

## Overview

ATR uses a smart LLM router to select the optimal model for each task. The goal is to always use the cheapest model that can handle the task effectively, while reserving premium models for complex work.

## Available Models

### Tier 1 — Premium (Complex)
| Model | Provider | Best For | Estimated Cost |
|-------|----------|----------|---------------|
| Claude Opus | Anthropic | Architecture, strategy, complex reasoning | $$$ |
| Gemini 3.0 | Google | Multi-modal, large context, complex analysis | $$$ |

### Tier 2 — Standard (Regular)
| Model | Provider | Best For | Estimated Cost |
|-------|----------|----------|---------------|
| Claude Sonnet | Anthropic | Features, research, documentation, conversation | $$ |

### Tier 3 — Fast (Simple)
| Model | Provider | Best For | Estimated Cost |
|-------|----------|----------|---------------|
| Claude Haiku | Anthropic | Quick edits, status, formatting, lookups | $ |
| Gemini Flash | Google | Fast iterations, simple code, quick Q&A | $ |

## Routing Algorithm

```typescript
interface TaskAnalysis {
  domain: 'code' | 'business' | 'research' | 'communication' | 'operations';
  complexity: number;        // 1-10 score
  tokensEstimated: number;   // input + output estimate
  latencySensitive: boolean; // user waiting for response?
  qualityCritical: boolean;  // high-stakes output?
  multiModal: boolean;       // needs image/audio analysis?
}

function selectModel(task: TaskAnalysis): ModelSelection {
  // Multi-modal tasks → Gemini 3.0 (best multi-modal support)
  if (task.multiModal) {
    return task.complexity > 5 
      ? { provider: 'google', model: 'gemini-3.0' }
      : { provider: 'google', model: 'gemini-flash' };
  }
  
  // Quality-critical + complex → Premium tier
  if (task.qualityCritical && task.complexity >= 7) {
    return { provider: 'anthropic', model: 'claude-opus' };
  }
  
  // Complex but not critical → Standard with fallback to premium
  if (task.complexity >= 5) {
    return { provider: 'anthropic', model: 'claude-sonnet' };
  }
  
  // Latency-sensitive simple tasks → Fast tier
  if (task.latencySensitive && task.complexity <= 3) {
    return { provider: 'google', model: 'gemini-flash' };
  }
  
  // Simple tasks → Haiku (cheapest)
  if (task.complexity <= 3) {
    return { provider: 'anthropic', model: 'claude-haiku' };
  }
  
  // Default → Sonnet (good balance)
  return { provider: 'anthropic', model: 'claude-sonnet' };
}
```

## Complexity Scoring Criteria

| Factor | Low (1-3) | Medium (4-6) | High (7-10) |
|--------|-----------|-------------|-------------|
| Scope | Single item | Multiple related items | System-wide |
| Reasoning | Lookup/format | Analysis/synthesis | Architecture/strategy |
| Context needed | Minimal | Moderate (few files) | Extensive (full project) |
| Creativity | Template/pattern | Adaptation | Novel solution |
| Stakes | Reversible, low impact | Moderate impact | Irreversible, high impact |

## Task-to-Tier Mapping Examples

### Tier 1 (Premium) Examples
- Design the database schema for a new feature
- Write a comprehensive GTM strategy
- Architect a multi-service integration
- Generate investor pitch deck content
- Red team analysis of business model

### Tier 2 (Standard) Examples
- Implement a new API endpoint
- Write documentation for a feature
- Research competitors in a market
- Generate marketing copy
- Code review and suggestions

### Tier 3 (Fast) Examples
- Fix a typo in code
- Format a document
- Quick status check
- Simple Q&A from knowledge base
- Config file updates

## Cost Tracking

```typescript
interface UsageRecord {
  tenantId: string;
  taskId: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;          // calculated based on provider pricing
  tier: 'premium' | 'standard' | 'fast';
  timestamp: Date;
}
```

### Cost Optimization Strategies
1. **Caching**: Cache responses for identical or similar queries
2. **Context pruning**: Only send relevant context to reduce tokens
3. **Progressive generation**: Start with fast model, escalate only if quality is insufficient
4. **Batching**: Group related small tasks into single calls
5. **Embedding-based retrieval**: Use vector search to find relevant context instead of sending everything

## Credit Mapping

User credits are consumed based on actual model costs:
- 1 credit = ~$0.01 (or equivalent unit)
- Each action's credit cost shown before execution (for manual approval actions)
- Real-time credit balance visible in dashboard
- Usage breakdown by category (code, research, communication, etc.)

## Monitoring & Optimization

- Weekly cost per tenant analysis
- Model quality tracking (user satisfaction per model tier)
- Route optimization: if Haiku handles a task well, route similar future tasks to Haiku
- A/B testing: periodically test if lower-tier models can handle higher-tier tasks
- Alert if a tenant's cost trajectory exceeds profitable threshold
