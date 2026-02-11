import { db } from "@/server/db";
import { usageRecords } from "@/server/db/schema";
import type { LLMResponse, ModelId } from "./types";
import { MODEL_PRICING } from "./types";

export function calculateCost(
  modelId: ModelId,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = MODEL_PRICING[modelId];
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPer1M;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPer1M;
  return inputCost + outputCost;
}

export async function trackUsage(
  tenantId: string,
  projectId: string | null,
  response: LLMResponse,
  taskType: string
) {
  const cost = calculateCost(
    response.model,
    response.usage.inputTokens,
    response.usage.outputTokens
  );

  await db.insert(usageRecords).values({
    tenantId,
    projectId,
    model: response.model,
    provider: response.provider,
    inputTokens: response.usage.inputTokens,
    outputTokens: response.usage.outputTokens,
    costUsd: cost.toFixed(6),
    taskType,
  });

  return cost;
}
