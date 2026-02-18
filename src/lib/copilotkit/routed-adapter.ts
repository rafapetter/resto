import type {
  CopilotServiceAdapter,
  CopilotRuntimeChatCompletionRequest,
  CopilotRuntimeChatCompletionResponse,
} from "@copilotkit/runtime";
import { analyzeTask } from "@/lib/llm/analyzer";
import { selectModel } from "@/lib/llm/router";

/**
 * A CopilotServiceAdapter wrapper that routes each chat message to the
 * appropriate LLM model based on task complexity analysis.
 *
 * Routes between Anthropic models only (Opus/Sonnet/Haiku) for reliable
 * CopilotKit tool calling. Gemini routing is skipped for chat — falls back
 * to Sonnet.
 */
export class RoutedAdapter implements CopilotServiceAdapter {
  name = "RoutedAdapter";

  constructor(
    private adapters: Record<string, CopilotServiceAdapter>,
    private defaultAdapter: CopilotServiceAdapter
  ) {}

  async process(
    request: CopilotRuntimeChatCompletionRequest
  ): Promise<CopilotRuntimeChatCompletionResponse> {
    // 1. Extract last user text message for task analysis
    // CopilotKit runtime Message is a class with isTextMessage() type guard
    const lastUserMsg = [...request.messages]
      .reverse()
      .find((m) => m.isTextMessage() && m.role === "user");

    const taskText =
      lastUserMsg && lastUserMsg.isTextMessage()
        ? lastUserMsg.content
        : "general chat";

    // 2. Analyze task and select model
    const analysis = analyzeTask(taskText);
    const selection = selectModel(analysis);

    // 3. Skip Gemini for chat (tool calling compatibility), fallback to Sonnet
    const modelId =
      selection.provider === "google"
        ? "claude-sonnet-4-5-20250929"
        : selection.modelId;

    // 4. Pick adapter or fall back to default
    const adapter = this.adapters[modelId] ?? this.defaultAdapter;

    console.log(
      `[LLM Router] ${modelId} — ${selection.reason} (complexity: ${analysis.complexity})`
    );

    // 5. Delegate to the selected adapter
    return adapter.process(request);
  }
}
