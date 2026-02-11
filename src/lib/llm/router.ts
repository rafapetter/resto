import { analyzeTask } from "./analyzer";
import { callAnthropic } from "./providers/anthropic";
import { callGemini } from "./providers/google";
import { getCachedResponse, setCachedResponse } from "./cache";
import { trackUsage } from "./cost-tracker";
import type {
  LLMRequest,
  LLMResponse,
  ModelSelection,
  TaskAnalysis,
} from "./types";

export function selectModel(analysis: TaskAnalysis): ModelSelection {
  // Multimodal + speed -> Gemini Flash
  if (analysis.isMultimodal || (analysis.requiresSpeed && analysis.complexity <= 3)) {
    return {
      modelId: "gemini-2.0-flash",
      provider: "google",
      reason: "Multimodal or fast simple task — routed to Gemini Flash",
    };
  }

  // Complex + critical -> Opus
  if (analysis.complexity >= 8 && analysis.isCritical) {
    return {
      modelId: "claude-opus-4-20250514",
      provider: "anthropic",
      reason: "Complex critical task — routed to Claude Opus",
    };
  }

  // Simple tasks -> Haiku
  if (analysis.complexity <= 3 && !analysis.isCritical) {
    return {
      modelId: "claude-haiku-3-5-20241022",
      provider: "anthropic",
      reason: "Simple non-critical task — routed to Claude Haiku",
    };
  }

  // Default -> Sonnet
  return {
    modelId: "claude-sonnet-4-20250514",
    provider: "anthropic",
    reason: "Standard task — routed to Claude Sonnet",
  };
}

export async function routeAndCall(
  request: LLMRequest,
  taskDescription: string,
  options?: {
    tenantId?: string;
    projectId?: string;
    taskType?: string;
    skipCache?: boolean;
  }
): Promise<LLMResponse> {
  // Check cache first
  if (!options?.skipCache) {
    const cached = await getCachedResponse(request.messages);
    if (cached) return cached;
  }

  // Analyze and route
  const analysis = analyzeTask(taskDescription);
  const selection = selectModel(analysis);

  // Call the selected provider
  let response: LLMResponse;

  if (selection.provider === "google") {
    response = await callGemini(request);
  } else {
    response = await callAnthropic(
      selection.modelId as Parameters<typeof callAnthropic>[0],
      request
    );
  }

  // Track usage
  if (options?.tenantId) {
    await trackUsage(
      options.tenantId,
      options.projectId ?? null,
      response,
      options.taskType ?? taskDescription
    );
  }

  // Cache the response
  if (!options?.skipCache) {
    await setCachedResponse(request.messages, response);
  }

  return response;
}
