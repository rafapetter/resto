import { analyzeTask } from "./analyzer";

describe("analyzeTask - complexity scoring", () => {
  it("returns baseline complexity of 5 for neutral text", () => {
    const result = analyzeTask("do something");
    expect(result.complexity).toBe(5);
  });

  it("adds 3 for 'architecture' keyword", () => {
    const result = analyzeTask("architecture review");
    expect(result.complexity).toBe(8);
  });

  it("subtracts 2 for 'format' keyword", () => {
    const result = analyzeTask("format the output");
    expect(result.complexity).toBe(3);
  });

  it("accumulates multiple keyword weights", () => {
    // architecture(+3) + security(+3) = 5+6 = 11 → clamped to 10
    const result = analyzeTask("architecture security review");
    expect(result.complexity).toBe(10);
  });

  it("clamps complexity to minimum 1", () => {
    // format(-2) + rename(-2) + explain(-1) + list(-1) + summarize(-1) = 5-7 = -2 → 1
    const result = analyzeTask("format rename explain list summarize");
    expect(result.complexity).toBe(1);
  });

  it("clamps complexity to maximum 10", () => {
    const result = analyzeTask("architecture security migration refactor debug");
    expect(result.complexity).toBe(10);
  });

  it("adds 1 for text >200 words", () => {
    const words = Array.from({ length: 201 }, (_, i) => `word${i}`).join(" ");
    const result = analyzeTask(words);
    expect(result.complexity).toBe(6); // 5 + 1
  });

  it("adds 2 total for text >500 words", () => {
    const words = Array.from({ length: 501 }, (_, i) => `word${i}`).join(" ");
    const result = analyzeTask(words);
    expect(result.complexity).toBe(7); // 5 + 1 + 1
  });
});

describe("analyzeTask - criticality", () => {
  it("marks 'deploy to production' as critical", () => {
    const result = analyzeTask("deploy to production");
    expect(result.isCritical).toBe(true);
  });

  it("marks 'payment processing' as critical", () => {
    const result = analyzeTask("handle payment processing");
    expect(result.isCritical).toBe(true);
  });

  it("marks ordinary text as not critical", () => {
    const result = analyzeTask("rename a variable");
    expect(result.isCritical).toBe(false);
  });

  it("detects critical keyword in context parameter", () => {
    const result = analyzeTask("do the thing", "deploy now");
    expect(result.isCritical).toBe(true);
  });
});

describe("analyzeTask - multimodal detection", () => {
  it("detects 'image' as multimodal", () => {
    expect(analyzeTask("analyze this image").isMultimodal).toBe(true);
  });

  it("detects 'screenshot' as multimodal", () => {
    expect(analyzeTask("check the screenshot").isMultimodal).toBe(true);
  });

  it("does not flag normal text as multimodal", () => {
    expect(analyzeTask("implement a feature").isMultimodal).toBe(false);
  });
});

describe("analyzeTask - speed detection", () => {
  it("detects 'quick' as requiring speed", () => {
    expect(analyzeTask("give me a quick summary").requiresSpeed).toBe(true);
  });

  it("does not flag complex tasks as requiring speed", () => {
    expect(analyzeTask("architecture review plan").requiresSpeed).toBe(false);
  });
});

describe("analyzeTask - category classification", () => {
  it("classifies 'implement the code' as coding", () => {
    expect(analyzeTask("implement the code").category).toBe("coding");
  });

  it("classifies 'deploy the app' as devops", () => {
    expect(analyzeTask("deploy the app").category).toBe("devops");
  });

  it("classifies 'design the ui' as design", () => {
    expect(analyzeTask("design the ui").category).toBe("design");
  });

  it("classifies 'plan the strategy' as planning", () => {
    expect(analyzeTask("plan the strategy").category).toBe("planning");
  });

  it("classifies generic text as general", () => {
    expect(analyzeTask("explain the concept").category).toBe("general");
  });
});
