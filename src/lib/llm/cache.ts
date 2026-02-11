import { kv } from "@vercel/kv";
import type { LLMResponse } from "./types";

const CACHE_TTL = 3600; // 1 hour

function hashKey(messages: Array<{ role: string; content: string }>): string {
  const str = JSON.stringify(messages);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `llm:cache:${hash.toString(36)}`;
}

export async function getCachedResponse(
  messages: Array<{ role: string; content: string }>
): Promise<LLMResponse | null> {
  try {
    const key = hashKey(messages);
    const cached = await kv.get<LLMResponse>(key);
    return cached;
  } catch {
    // KV not available — skip cache
    return null;
  }
}

export async function setCachedResponse(
  messages: Array<{ role: string; content: string }>,
  response: LLMResponse
): Promise<void> {
  try {
    const key = hashKey(messages);
    await kv.set(key, response, { ex: CACHE_TTL });
  } catch {
    // KV not available — skip cache
  }
}
