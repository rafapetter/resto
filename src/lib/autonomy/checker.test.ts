// Mock the DB module
vi.mock("@/server/db", () => ({
  db: {
    query: {
      autonomySettings: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(() => ({ values: vi.fn() })),
  },
}));
vi.mock("@/server/db/schema", () => ({
  autonomySettings: {},
  auditLog: {},
}));

import { AutonomyChecker } from "./checker";
import { db } from "@/server/db";
import {
  DEFAULT_AUTONOMY,
  RISK_TO_MIN_LEVEL,
  type ActionRequest,
} from "./types";

const mockFindFirst = vi.mocked(
  db.query.autonomySettings.findFirst
);

describe("AutonomyChecker.getLevel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns project-specific setting when found", async () => {
    mockFindFirst.mockResolvedValueOnce({ level: "manual_only" } as any);
    const checker = new AutonomyChecker("t1", "p1");
    const level = await checker.getLevel("deployment");
    expect(level).toBe("manual_only");
  });

  it("falls back to tenant-level setting when no project setting", async () => {
    mockFindFirst
      .mockResolvedValueOnce(undefined) // project-specific: not found
      .mockResolvedValueOnce({ level: "quick_confirm" } as any); // tenant-level
    const checker = new AutonomyChecker("t1", "p1");
    const level = await checker.getLevel("deployment");
    expect(level).toBe("quick_confirm");
  });

  it("falls back to DEFAULT_AUTONOMY when no settings found", async () => {
    mockFindFirst.mockResolvedValue(undefined);
    const checker = new AutonomyChecker("t1", "p1");
    const level = await checker.getLevel("deployment");
    expect(level).toBe(DEFAULT_AUTONOMY.deployment);
  });

  it("skips project query when no projectId", async () => {
    mockFindFirst.mockResolvedValueOnce({ level: "full_auto" } as any);
    const checker = new AutonomyChecker("t1"); // no projectId
    const level = await checker.getLevel("knowledge_management");
    // Should only call findFirst once (tenant-level)
    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(level).toBe("full_auto");
  });
});

describe("AutonomyChecker.check", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const makeRequest = (
    overrides: Partial<ActionRequest> = {}
  ): ActionRequest => ({
    category: "knowledge_management",
    action: "createDoc",
    description: "Create a document",
    risk: "low",
    ...overrides,
  });

  it("auto-approves when level is full_auto", async () => {
    mockFindFirst.mockResolvedValue(undefined); // uses defaults
    const checker = new AutonomyChecker("t1", "p1");
    // knowledge_management default is "full_auto", low risk min is "full_auto"
    const result = await checker.check(makeRequest());
    expect(result.approved).toBe(true);
    expect(result.level).toBe("full_auto");
  });

  it("auto-approves with notify_after level", async () => {
    mockFindFirst.mockResolvedValue(undefined);
    const checker = new AutonomyChecker("t1", "p1");
    // code_generation default is "notify_after"
    const result = await checker.check(
      makeRequest({ category: "code_generation", risk: "low" })
    );
    expect(result.approved).toBe(true);
    expect(result.level).toBe("notify_after");
  });

  it("requires approval for quick_confirm level", async () => {
    mockFindFirst.mockResolvedValue(undefined);
    const checker = new AutonomyChecker("t1", "p1");
    // integrations default is "quick_confirm"
    const result = await checker.check(
      makeRequest({ category: "integrations", risk: "low" })
    );
    expect(result.approved).toBe(false);
    expect(result.level).toBe("quick_confirm");
  });

  it("requires approval for detailed_approval level", async () => {
    mockFindFirst.mockResolvedValue(undefined);
    const checker = new AutonomyChecker("t1", "p1");
    // deployment default is "detailed_approval"
    const result = await checker.check(
      makeRequest({ category: "deployment", risk: "low" })
    );
    expect(result.approved).toBe(false);
    expect(result.level).toBe("detailed_approval");
  });

  it("requires approval for manual_only level", async () => {
    mockFindFirst.mockResolvedValue(undefined);
    const checker = new AutonomyChecker("t1", "p1");
    // financial default is "manual_only"
    const result = await checker.check(
      makeRequest({ category: "financial", risk: "low" })
    );
    expect(result.approved).toBe(false);
    expect(result.level).toBe("manual_only");
  });

  it("uses stricter of configured vs risk-based level", async () => {
    // Configured: full_auto (index 0), Risk: critical → detailed_approval (index 3)
    mockFindFirst.mockResolvedValue(undefined);
    const checker = new AutonomyChecker("t1", "p1");
    const result = await checker.check(
      makeRequest({
        category: "knowledge_management", // default: full_auto
        risk: "critical", // min level: detailed_approval
      })
    );
    // Risk-based level (detailed_approval) is stricter → used
    expect(result.approved).toBe(false);
    expect(result.level).toBe("detailed_approval");
  });

  it("uses configured level when stricter than risk-based", async () => {
    mockFindFirst.mockResolvedValue(undefined);
    const checker = new AutonomyChecker("t1", "p1");
    const result = await checker.check(
      makeRequest({
        category: "financial", // default: manual_only (strictest)
        risk: "low", // min level: full_auto (most permissive)
      })
    );
    // Configured level (manual_only) is stricter → used
    expect(result.level).toBe("manual_only");
  });

  it("includes reason message when approval needed", async () => {
    mockFindFirst.mockResolvedValue(undefined);
    const checker = new AutonomyChecker("t1", "p1");
    const result = await checker.check(
      makeRequest({ category: "deployment", action: "deployToProduction" })
    );
    expect(result.reason).toContain("deployToProduction");
    expect(result.reason).toContain("detailed_approval");
    expect(result.reason).toContain("deployment");
  });
});

describe("DEFAULT_AUTONOMY", () => {
  it("has all 6 categories configured", () => {
    const categories = Object.keys(DEFAULT_AUTONOMY);
    expect(categories).toHaveLength(6);
    expect(categories).toContain("knowledge_management");
    expect(categories).toContain("code_generation");
    expect(categories).toContain("deployment");
    expect(categories).toContain("integrations");
    expect(categories).toContain("communications");
    expect(categories).toContain("financial");
  });

  it("knowledge_management is most permissive (full_auto)", () => {
    expect(DEFAULT_AUTONOMY.knowledge_management).toBe("full_auto");
  });

  it("financial is most restrictive (manual_only)", () => {
    expect(DEFAULT_AUTONOMY.financial).toBe("manual_only");
  });
});

describe("RISK_TO_MIN_LEVEL", () => {
  it("maps low risk to full_auto", () => {
    expect(RISK_TO_MIN_LEVEL.low).toBe("full_auto");
  });

  it("maps medium risk to notify_after", () => {
    expect(RISK_TO_MIN_LEVEL.medium).toBe("notify_after");
  });

  it("maps high risk to quick_confirm", () => {
    expect(RISK_TO_MIN_LEVEL.high).toBe("quick_confirm");
  });

  it("maps critical risk to detailed_approval", () => {
    expect(RISK_TO_MIN_LEVEL.critical).toBe("detailed_approval");
  });
});
