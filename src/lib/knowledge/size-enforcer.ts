import { TIER_LIMITS, type KnowledgeTier } from "./types";

export type SizeCheck = {
  withinLimits: boolean;
  lineCount: number;
  charCount: number;
  maxLines: number;
  maxChars: number;
  needsSplit: boolean;
};

export function checkSize(content: string, tier: KnowledgeTier): SizeCheck {
  const lines = content.split("\n");
  const lineCount = lines.length;
  const charCount = content.length;
  const limits = TIER_LIMITS[tier];

  return {
    withinLimits:
      lineCount <= limits.maxLines && charCount <= limits.maxChars,
    lineCount,
    charCount,
    maxLines: limits.maxLines,
    maxChars: limits.maxChars,
    needsSplit: charCount > limits.maxChars,
  };
}

export function splitContent(
  content: string,
  tier: KnowledgeTier
): string[] {
  const limits = TIER_LIMITS[tier];
  const parts: string[] = [];
  const paragraphs = content.split("\n\n");

  let current = "";
  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > limits.maxChars && current) {
      parts.push(current.trim());
      current = para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}
