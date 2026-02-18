export type LLMProvider = "anthropic" | "google";

export type ModelId =
  | "claude-opus-4-5-20250514"
  | "claude-sonnet-4-5-20250929"
  | "claude-haiku-4-5-20251001"
  | "gemini-2.0-flash";

export type TaskComplexity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type TaskAnalysis = {
  complexity: TaskComplexity;
  isCritical: boolean;
  isMultimodal: boolean;
  requiresSpeed: boolean;
  category: string;
  reasoning: string;
};

export type ModelSelection = {
  modelId: ModelId;
  provider: LLMProvider;
  reason: string;
};

export type UsageRecord = {
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  taskType: string;
};

export type ModelPricing = {
  inputPer1M: number;
  outputPer1M: number;
};

export const MODEL_PRICING: Record<ModelId, ModelPricing> = {
  "claude-opus-4-5-20250514": { inputPer1M: 15, outputPer1M: 75 },
  "claude-sonnet-4-5-20250929": { inputPer1M: 3, outputPer1M: 15 },
  "claude-haiku-4-5-20251001": { inputPer1M: 0.8, outputPer1M: 4 },
  "gemini-2.0-flash": { inputPer1M: 0.075, outputPer1M: 0.3 },
};

export type LLMRequest = {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
};

export type LLMResponse = {
  content: string;
  model: ModelId;
  provider: LLMProvider;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
};
