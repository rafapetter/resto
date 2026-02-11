export type KnowledgeTier = "index" | "summary" | "detail";

export type KnowledgeFile = {
  id: string;
  tenantId: string;
  projectId: string;
  tier: KnowledgeTier;
  title: string;
  blobUrl: string;
  sizeBytes: number;
  lineCount: number;
  charCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type KnowledgeChunk = {
  id: string;
  fileId: string;
  chunkIndex: number;
  content: string;
  embedding: number[];
};

export type SearchResult = {
  fileId: string;
  title: string;
  tier: KnowledgeTier;
  chunkContent: string;
  similarity: number;
};

export type TierLimits = {
  maxLines: number;
  maxChars: number;
};

export const TIER_LIMITS: Record<KnowledgeTier, TierLimits> = {
  index: { maxLines: 50, maxChars: 2000 },
  summary: { maxLines: 50, maxChars: 2000 },
  detail: { maxLines: 1000, maxChars: 50000 },
};

export type CreateKnowledgeInput = {
  tenantId: string;
  projectId: string;
  tier: KnowledgeTier;
  title: string;
  content: string;
};

export type UpdateKnowledgeInput = {
  id: string;
  tenantId: string;
  title?: string;
  content?: string;
  tier?: KnowledgeTier;
};
