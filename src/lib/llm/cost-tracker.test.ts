// Mock the DB module to prevent import errors
vi.mock("@/server/db", () => ({ db: { insert: vi.fn() } }));
vi.mock("@/server/db/schema", () => ({ usageRecords: {} }));

import { calculateCost } from "./cost-tracker";
import { MODEL_PRICING } from "./types";

describe("calculateCost", () => {
  it("returns 0 for zero tokens", () => {
    expect(calculateCost("claude-sonnet-4-20250514", 0, 0)).toBe(0);
  });

  it("calculates Opus input cost: 1M tokens at $15/M = $15", () => {
    const cost = calculateCost("claude-opus-4-20250514", 1_000_000, 0);
    expect(cost).toBe(15);
  });

  it("calculates Opus output cost: 1M tokens at $75/M = $75", () => {
    const cost = calculateCost("claude-opus-4-20250514", 0, 1_000_000);
    expect(cost).toBe(75);
  });

  it("calculates Sonnet mixed cost correctly", () => {
    // 500k input at $3/M + 500k output at $15/M = $1.50 + $7.50 = $9
    const cost = calculateCost("claude-sonnet-4-20250514", 500_000, 500_000);
    expect(cost).toBe(9);
  });

  it("calculates Haiku as cheapest Anthropic model", () => {
    const cost = calculateCost("claude-haiku-3-5-20241022", 1_000_000, 1_000_000);
    // $0.80 + $4.00 = $4.80
    expect(cost).toBeCloseTo(4.8);
  });

  it("calculates Gemini Flash as lowest cost", () => {
    const cost = calculateCost("gemini-2.0-flash", 1_000_000, 1_000_000);
    // $0.075 + $0.30 = $0.375
    expect(cost).toBeCloseTo(0.375);
  });

  it("scales linearly with token count", () => {
    const cost1 = calculateCost("claude-sonnet-4-20250514", 100_000, 100_000);
    const cost2 = calculateCost("claude-sonnet-4-20250514", 200_000, 200_000);
    expect(cost2).toBeCloseTo(cost1 * 2);
  });

  it("handles small token counts with precision", () => {
    // 1000 input tokens at $3/M = $0.003
    const cost = calculateCost("claude-sonnet-4-20250514", 1000, 0);
    expect(cost).toBeCloseTo(0.003, 6);
  });

  it("uses correct pricing for all models from MODEL_PRICING", () => {
    for (const [modelId, pricing] of Object.entries(MODEL_PRICING)) {
      const cost = calculateCost(modelId as any, 1_000_000, 1_000_000);
      expect(cost).toBe(pricing.inputPer1M + pricing.outputPer1M);
    }
  });
});
