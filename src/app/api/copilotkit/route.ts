import {
  CopilotRuntime,
  AnthropicAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import Anthropic from "@anthropic-ai/sdk";
import { RoutedAdapter } from "@/lib/copilotkit/routed-adapter";

const anthropic = new Anthropic();

// Pre-create one adapter per Anthropic model
const adapters: Record<string, AnthropicAdapter> = {
  "claude-opus-4-20250514": new AnthropicAdapter({
    anthropic,
    model: "claude-opus-4-20250514",
  }),
  "claude-sonnet-4-20250514": new AnthropicAdapter({
    anthropic,
    model: "claude-sonnet-4-20250514",
  }),
  "claude-haiku-3-5-20241022": new AnthropicAdapter({
    anthropic,
    model: "claude-haiku-3-5-20241022",
  }),
};

const serviceAdapter = new RoutedAdapter(
  adapters,
  adapters["claude-sonnet-4-20250514"]
);

const runtime = new CopilotRuntime({
  delegateAgentProcessingToServiceAdapter: true,
});

export const POST = async (req: Request) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
