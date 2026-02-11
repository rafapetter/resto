import { GoogleGenerativeAI } from "@google/generative-ai";
import type { LLMRequest, LLMResponse } from "../types";

export async function callGemini(request: LLMRequest): Promise<LLMResponse> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is required");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const systemParts = request.messages
    .filter((m) => m.role === "system")
    .map((m) => m.content);

  const systemInstruction = [request.systemPrompt, ...systemParts]
    .filter(Boolean)
    .join("\n\n");

  const history = request.messages
    .filter((m) => m.role !== "system")
    .slice(0, -1)
    .map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

  const lastMessage = request.messages.filter((m) => m.role !== "system").pop();

  const chat = model.startChat({
    history,
    systemInstruction: systemInstruction || undefined,
  });

  const result = await chat.sendMessage(lastMessage?.content ?? "");
  const response = result.response;
  const text = response.text();
  const usage = response.usageMetadata;

  return {
    content: text,
    model: "gemini-2.0-flash",
    provider: "google",
    usage: {
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: usage?.candidatesTokenCount ?? 0,
    },
  };
}
