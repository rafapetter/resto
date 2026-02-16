describe("rateLimit", () => {
  let rateLimit: typeof import("./rate-limit").rateLimit;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    const mod = await import("./rate-limit");
    rateLimit = mod.rateLimit;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("first call succeeds with remaining = limit - 1", () => {
    const result = rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("successive calls decrement remaining", () => {
    rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    const result = rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(3);
  });

  it("returns success=false when limit is reached", () => {
    for (let i = 0; i < 5; i++) {
      rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    }
    const result = rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets count after window expires", () => {
    for (let i = 0; i < 5; i++) {
      rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    }
    // Advance past the window
    vi.advanceTimersByTime(60001);
    const result = rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("different keys are independent", () => {
    rateLimit({ key: "a", limit: 1, windowMs: 60000 });
    const resultB = rateLimit({ key: "b", limit: 1, windowMs: 60000 });
    expect(resultB.success).toBe(true);
  });

  it("call at exact window boundary resets", () => {
    rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    vi.advanceTimersByTime(60000);
    const result = rateLimit({ key: "a", limit: 5, windowMs: 60000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("rapid calls within window are counted correctly", () => {
    const limit = 10;
    for (let i = 0; i < limit; i++) {
      const result = rateLimit({ key: "a", limit, windowMs: 60000 });
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(limit - 1 - i);
    }
    const result = rateLimit({ key: "a", limit, windowMs: 60000 });
    expect(result.success).toBe(false);
  });
});

describe("rateLimit - cleanup", () => {
  let rateLimit: typeof import("./rate-limit").rateLimit;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    const mod = await import("./rate-limit");
    rateLimit = mod.rateLimit;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("expired entries are cleaned up after 60s gap", () => {
    // Create an entry that will expire
    rateLimit({ key: "old", limit: 5, windowMs: 1000 });

    // Advance past both the entry's window and the cleanup interval
    vi.advanceTimersByTime(61000);

    // This call triggers cleanup
    rateLimit({ key: "new", limit: 5, windowMs: 60000 });

    // The old entry should be cleaned — accessing it resets
    const result = rateLimit({ key: "old", limit: 5, windowMs: 1000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("cleanup does not remove active entries", () => {
    rateLimit({ key: "active", limit: 5, windowMs: 120000 });
    rateLimit({ key: "active", limit: 5, windowMs: 120000 });

    // Advance past cleanup interval but NOT past the entry window
    vi.advanceTimersByTime(61000);

    // Trigger cleanup
    rateLimit({ key: "trigger", limit: 5, windowMs: 60000 });

    // Active entry should still have its count
    const result = rateLimit({ key: "active", limit: 5, windowMs: 120000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2); // 5 - 3
  });
});
