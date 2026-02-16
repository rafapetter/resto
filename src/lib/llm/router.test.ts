// Mock modules with DB/API side effects to prevent import failures
vi.mock("./providers/anthropic", () => ({ callAnthropic: vi.fn() }));
vi.mock("./providers/google", () => ({ callGemini: vi.fn() }));
vi.mock("./cache", () => ({
  getCachedResponse: vi.fn(),
  setCachedResponse: vi.fn(),
}));
vi.mock("./cost-tracker", () => ({ trackUsage: vi.fn() }));

import { selectModel } from "./router";
import type { TaskAnalysis } from "./types";

function makeAnalysis(overrides: Partial<TaskAnalysis> = {}): TaskAnalysis {
  return {
    complexity: 5 as TaskAnalysis["complexity"],
    isCritical: false,
    isMultimodal: false,
    requiresSpeed: false,
    category: "general",
    reasoning: "test",
    ...overrides,
  };
}

describe("selectModel", () => {
  it("routes multimodal task to Gemini Flash", () => {
    const result = selectModel(makeAnalysis({ isMultimodal: true }));
    expect(result.modelId).toBe("gemini-2.0-flash");
    expect(result.provider).toBe("google");
  });

  it("routes fast + simple task (complexity ≤3, requiresSpeed) to Gemini Flash", () => {
    const result = selectModel(
      makeAnalysis({
        complexity: 3 as TaskAnalysis["complexity"],
        requiresSpeed: true,
      })
    );
    expect(result.modelId).toBe("gemini-2.0-flash");
    expect(result.provider).toBe("google");
  });

  it("routes complex (≥8) + critical task to Claude Opus", () => {
    const result = selectModel(
      makeAnalysis({
        complexity: 8 as TaskAnalysis["complexity"],
        isCritical: true,
      })
    );
    expect(result.modelId).toBe("claude-opus-4-20250514");
    expect(result.provider).toBe("anthropic");
  });

  it("routes simple (≤3) + non-critical task to Claude Haiku", () => {
    const result = selectModel(
      makeAnalysis({ complexity: 3 as TaskAnalysis["complexity"] })
    );
    expect(result.modelId).toBe("claude-haiku-3-5-20241022");
    expect(result.provider).toBe("anthropic");
  });

  it("routes medium complexity to Claude Sonnet (default)", () => {
    const result = selectModel(makeAnalysis());
    expect(result.modelId).toBe("claude-sonnet-4-20250514");
    expect(result.provider).toBe("anthropic");
  });

  it("routes complexity 3 + critical to Sonnet (not Haiku)", () => {
    const result = selectModel(
      makeAnalysis({
        complexity: 3 as TaskAnalysis["complexity"],
        isCritical: true,
      })
    );
    expect(result.modelId).toBe("claude-sonnet-4-20250514");
  });

  it("routes complexity 8 + non-critical to Sonnet (not Opus)", () => {
    const result = selectModel(
      makeAnalysis({ complexity: 8 as TaskAnalysis["complexity"] })
    );
    expect(result.modelId).toBe("claude-sonnet-4-20250514");
  });

  it("routes complexity 4 + requiresSpeed to Sonnet (not Gemini)", () => {
    const result = selectModel(
      makeAnalysis({
        complexity: 4 as TaskAnalysis["complexity"],
        requiresSpeed: true,
      })
    );
    expect(result.modelId).toBe("claude-sonnet-4-20250514");
  });

  it("gives multimodal priority over complex+critical", () => {
    const result = selectModel(
      makeAnalysis({
        complexity: 9 as TaskAnalysis["complexity"],
        isCritical: true,
        isMultimodal: true,
      })
    );
    expect(result.modelId).toBe("gemini-2.0-flash");
  });

  it("returns a non-empty reason string for every routing path", () => {
    const analyses: TaskAnalysis[] = [
      makeAnalysis({ isMultimodal: true }),
      makeAnalysis({
        complexity: 8 as TaskAnalysis["complexity"],
        isCritical: true,
      }),
      makeAnalysis({ complexity: 2 as TaskAnalysis["complexity"] }),
      makeAnalysis(),
    ];
    for (const analysis of analyses) {
      const result = selectModel(analysis);
      expect(result.reason).toBeTruthy();
    }
  });

  it("returns correct provider for all Claude models", () => {
    const haiku = selectModel(
      makeAnalysis({ complexity: 1 as TaskAnalysis["complexity"] })
    );
    const sonnet = selectModel(makeAnalysis());
    const opus = selectModel(
      makeAnalysis({
        complexity: 10 as TaskAnalysis["complexity"],
        isCritical: true,
      })
    );
    expect(haiku.provider).toBe("anthropic");
    expect(sonnet.provider).toBe("anthropic");
    expect(opus.provider).toBe("anthropic");
  });
});
