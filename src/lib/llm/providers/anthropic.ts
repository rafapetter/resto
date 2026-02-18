import Anthropic from "@anthropic-ai/sdk";
import type { LLMRequest, LLMResponse, ModelId } from "../types";

const client = new Anthropic();

type AnthropicModel = Extract<
  ModelId,
  "claude-opus-4-5-20250514" | "claude-sonnet-4-5-20250929" | "claude-haiku-4-5-20251001"
>;

export async function callAnthropic(
  model: AnthropicModel,
  request: LLMRequest
): Promise<LLMResponse> {
  const messages = request.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const systemMessages = request.messages
    .filter((m) => m.role === "system")
    .map((m) => m.content);

  const systemPrompt = [request.systemPrompt, ...systemMessages]
    .filter(Boolean)
    .join("\n\n");

  const response = await client.messages.create({
    model,
    max_tokens: request.maxTokens ?? 4096,
    temperature: request.temperature ?? 0.7,
    system: systemPrompt || undefined,
    messages,
  });

  const textContent = response.content.find((c) => c.type === "text");

  return {
    content: textContent?.text ?? "",
    model,
    provider: "anthropic",
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  };
}
