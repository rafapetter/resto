import type { TaskAnalysis, TaskComplexity } from "./types";

const COMPLEXITY_SIGNALS: Record<string, number> = {
  // High complexity indicators
  architecture: 3,
  security: 3,
  migration: 3,
  refactor: 2,
  debug: 2,
  integrate: 2,
  deploy: 2,
  strategy: 2,

  // Medium complexity
  implement: 1,
  create: 1,
  build: 1,
  update: 1,
  configure: 1,

  // Low complexity
  explain: -1,
  list: -1,
  summarize: -1,
  format: -2,
  rename: -2,
};

const CRITICAL_KEYWORDS = [
  "deploy",
  "production",
  "payment",
  "billing",
  "credential",
  "secret",
  "delete",
  "remove",
  "migrate",
  "security",
];

export function analyzeTask(
  description: string,
  context?: string
): TaskAnalysis {
  const text = `${description} ${context ?? ""}`.toLowerCase();
  const words = text.split(/\s+/);

  // Calculate complexity score
  let score = 5; // baseline
  for (const [keyword, weight] of Object.entries(COMPLEXITY_SIGNALS)) {
    if (text.includes(keyword)) {
      score += weight;
    }
  }

  // Factor in text length as proxy for complexity
  if (words.length > 200) score += 1;
  if (words.length > 500) score += 1;

  // Clamp to 1-10
  const complexity = Math.max(1, Math.min(10, score)) as TaskComplexity;

  // Check criticality
  const isCritical = CRITICAL_KEYWORDS.some((kw) => text.includes(kw));

  // Check multimodal needs
  const isMultimodal =
    text.includes("image") ||
    text.includes("screenshot") ||
    text.includes("diagram") ||
    text.includes("photo");

  // Check speed requirements
  const requiresSpeed =
    text.includes("quick") ||
    text.includes("fast") ||
    text.includes("simple") ||
    text.includes("brief");

  // Determine category
  let category = "general";
  if (text.includes("code") || text.includes("implement")) category = "coding";
  if (text.includes("deploy") || text.includes("build")) category = "devops";
  if (text.includes("design") || text.includes("ui")) category = "design";
  if (text.includes("plan") || text.includes("strategy")) category = "planning";

  return {
    complexity,
    isCritical,
    isMultimodal,
    requiresSpeed,
    category,
    reasoning: `Complexity ${complexity}/10. ${isCritical ? "Critical action. " : ""}${isMultimodal ? "Multimodal content. " : ""}Category: ${category}.`,
  };
}
