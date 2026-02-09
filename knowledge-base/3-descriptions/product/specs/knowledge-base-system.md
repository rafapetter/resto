# Knowledge Base System — Detailed Design | v1.0.0 | 2026-02-03

## Overview

Every business on ATR has a self-maintaining 3-tier knowledge base. It's the persistent memory of the AI co-founder — automatically built and updated from conversations, integrations, research, and agent actions.

## 3-Tier Structure

### 1st Tier — Index
- **Purpose**: Master directory of all topics
- **Max per file**: 50 lines
- **Format**: `<Topic Name> | <Topic Short Description> | <Topic Summary Location>`
- **Storage**: Single file (or split if >50 lines) in Vercel Blob
- **Metadata**: Indexed in Postgres for fast lookup
- **Auto-split**: If file exceeds 50 lines, automatically split into thematic groups

### 2nd Tier — Summaries
- **Purpose**: Condensed overview of each topic
- **Max per file**: 2,000 characters
- **Format**: `<Topic Title> | <Topic Version and Last Update> | <Topic Long Summary>`
- **Storage**: MD files organized in folders in Vercel Blob
- **Auto-split**: If file exceeds 2,000 characters, split into sub-topics

### 3rd Tier — Descriptions
- **Purpose**: Full detailed content for each topic
- **Max per file**: 50,000 characters
- **Format**: `<SubTopic Title> | <SubTopic Version and Last Update> | <SubTopic Long Description>`
- **Storage**: MD files in nested folders in Vercel Blob
- **Auto-split**: If file exceeds 50,000 characters, divide into logical sections

### Assets
- **Purpose**: Non-MD files (PDFs, images, spreadsheets, media)
- **Storage**: Vercel Blob, referenced from MD files
- **Organization**: Mirrors tier folder structure

## Auto-Generation Pipeline

### From Conversations
```
User message / Agent response
  → Extract key decisions, facts, requirements
  → Classify into knowledge categories
  → Update relevant 2nd tier summary
  → If significant detail, update/create 3rd tier description
  → Update 1st tier index if new topic
  → Version bump on modified files
```

### From Integrations
```
Integration event (deployment, payment, analytics data)
  → Extract relevant metrics / status
  → Update operational knowledge (DevOps, Finance sections)
  → Log in Documentation tier
```

### From Research
```
Agent performs research (web search, competitor analysis)
  → Synthesize findings
  → Create/update Research section in Documentation
  → Update relevant domain summaries (Market, Competitive)
```

### From Code Changes
```
Code generated / modified
  → Update Tech Stack sections
  → Update Implementation Plan progress
  → Log in Documentation changelog
```

## Knowledge Retrieval

### For Agent Context Loading
When the Master Agent spawns a task instance, it needs to load relevant knowledge:

1. **Query the 1st tier index** to identify relevant topic areas
2. **Load relevant 2nd tier summaries** for overview context
3. **Selectively load 3rd tier descriptions** only for topics directly relevant to the task
4. **Use pgvector semantic search** for fuzzy matching ("find everything related to payment integration")

### Retrieval Strategy
```typescript
async function loadContextForTask(taskType: string, taskDescription: string): Promise<KnowledgeContext> {
  // 1. Always load index
  const index = await loadTierOne();
  
  // 2. Identify relevant topics from index
  const relevantTopics = await identifyRelevantTopics(index, taskType, taskDescription);
  
  // 3. Load summaries for relevant topics
  const summaries = await loadTierTwo(relevantTopics);
  
  // 4. Semantic search for additional relevant content
  const embedding = await generateEmbedding(taskDescription);
  const semanticResults = await pgvectorSearch(embedding, { limit: 5 });
  
  // 5. Load detailed descriptions only if needed
  const descriptions = await loadTierThree(
    relevantTopics.filter(t => t.needsDetail)
  );
  
  return { index, summaries, descriptions, semanticResults };
}
```

## Size Limit Enforcement

```typescript
async function enforceFileSizeLimits(file: KnowledgeFile): Promise<KnowledgeFile[]> {
  const content = file.content;
  
  switch (file.tier) {
    case 1: // Max 50 lines
      if (countLines(content) > 50) {
        return splitByTheme(content, 50);
      }
      break;
      
    case 2: // Max 2,000 characters
      if (content.length > 2000) {
        return splitInHalf(content, 2000);
      }
      break;
      
    case 3: // Max 50,000 characters
      if (content.length > 50000) {
        return splitBySection(content, 50000);
      }
      break;
  }
  
  return [file];
}
```

## Versioning

Every knowledge file has:
- **Version**: Semantic version (major.minor.patch)
- **Last Updated**: Timestamp
- **Changed By**: 'agent' | 'user' | 'system'
- **Change Summary**: Brief description of what changed

Version history stored in Postgres (not in the MD files themselves):

```sql
CREATE TABLE knowledge_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  version VARCHAR(20) NOT NULL,
  changed_by VARCHAR(20) NOT NULL,
  change_summary TEXT,
  previous_content_hash VARCHAR(64),
  new_content_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Vector Embeddings

For semantic search across the knowledge base:

```sql
CREATE TABLE knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536),  -- text-embedding-3-small dimension
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_embeddings_tenant (tenant_id)
);
```

Embeddings are regenerated whenever a knowledge file is updated. Chunks are sized for optimal retrieval (~500 tokens each).

## Folder Structure Per Tenant

```
{tenant_id}/
  1-index/
    index.md
  2-summaries/
    agent/
    organization/
    product/
    ai/
    documentation/
    prompts/
    gtm/
    unit-economics/
    critical-review/
    security/
    user/
    ...
  3-descriptions/
    {topic}/
      {subtopic}/
        {file}.md
  assets/
    {organized by topic}
```

Each tenant's knowledge base is fully isolated in Vercel Blob under their tenant ID prefix.
