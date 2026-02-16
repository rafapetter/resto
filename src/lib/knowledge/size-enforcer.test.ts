import { checkSize, splitContent } from "./size-enforcer";

describe("checkSize", () => {
  it("short content is within limits for index tier", () => {
    const result = checkSize("Hello world", "index");
    expect(result.withinLimits).toBe(true);
    expect(result.needsSplit).toBe(false);
  });

  it("short content is within limits for detail tier", () => {
    const result = checkSize("Hello world", "detail");
    expect(result.withinLimits).toBe(true);
  });

  it("content at exact char limit is within limits (index)", () => {
    const content = "x".repeat(2000);
    const result = checkSize(content, "index");
    expect(result.withinLimits).toBe(true);
    expect(result.charCount).toBe(2000);
  });

  it("content 1 char over limit is NOT within limits (index)", () => {
    const content = "x".repeat(2001);
    const result = checkSize(content, "index");
    expect(result.withinLimits).toBe(false);
    expect(result.needsSplit).toBe(true);
  });

  it("content at exact line limit is within limits (index)", () => {
    const lines = Array.from({ length: 50 }, () => "line").join("\n");
    const result = checkSize(lines, "index");
    expect(result.withinLimits).toBe(true);
    expect(result.lineCount).toBe(50);
  });

  it("content 1 line over is NOT within limits (index)", () => {
    const lines = Array.from({ length: 51 }, () => "line").join("\n");
    const result = checkSize(lines, "index");
    expect(result.withinLimits).toBe(false);
  });

  it("needsSplit is true only when charCount exceeds maxChars", () => {
    // 51 lines but under 2000 chars → lines over limit but needsSplit is false
    const lines = Array.from({ length: 51 }, () => "x").join("\n");
    const result = checkSize(lines, "index");
    expect(result.withinLimits).toBe(false); // over line limit
    expect(result.needsSplit).toBe(false); // chars are fine
  });

  it("returns accurate lineCount and charCount", () => {
    const content = "line1\nline2\nline3";
    const result = checkSize(content, "index");
    expect(result.lineCount).toBe(3);
    expect(result.charCount).toBe(17);
  });

  it("detail tier has higher limits", () => {
    const content = "x".repeat(10000);
    const result = checkSize(content, "detail");
    expect(result.withinLimits).toBe(true);
    expect(result.maxChars).toBe(50000);
    expect(result.maxLines).toBe(1000);
  });

  it("summary tier has same limits as index", () => {
    const result = checkSize("x".repeat(2001), "summary");
    expect(result.withinLimits).toBe(false);
    expect(result.maxChars).toBe(2000);
  });
});

describe("splitContent", () => {
  it("returns single part when content is within limits", () => {
    const content = "short text";
    const parts = splitContent(content, "index");
    expect(parts).toHaveLength(1);
    expect(parts[0]).toBe("short text");
  });

  it("splits oversized content into multiple parts", () => {
    const paragraphs = Array.from(
      { length: 10 },
      (_, i) => "p".repeat(300) + i
    );
    const content = paragraphs.join("\n\n");
    const parts = splitContent(content, "index"); // 2000 char limit
    expect(parts.length).toBeGreaterThan(1);
  });

  it("each part respects the tier maxChars limit", () => {
    const paragraphs = Array.from({ length: 20 }, () => "word ".repeat(100));
    const content = paragraphs.join("\n\n");
    const parts = splitContent(content, "index");
    for (const part of parts) {
      expect(part.length).toBeLessThanOrEqual(2000);
    }
  });

  it("splits on paragraph boundaries (double newline)", () => {
    const para1 = "a".repeat(1500);
    const para2 = "b".repeat(1500);
    const content = `${para1}\n\n${para2}`;
    const parts = splitContent(content, "index");
    expect(parts.length).toBe(2);
    expect(parts[0]).toBe(para1);
    expect(parts[1]).toBe(para2);
  });

  it("preserves all content across parts", () => {
    const paragraphs = Array.from({ length: 5 }, (_, i) => `paragraph-${i}`);
    const content = paragraphs.join("\n\n");
    const parts = splitContent(content, "index");
    const joined = parts.join("\n\n");
    expect(joined).toBe(content);
  });

  it("handles content with no paragraph breaks", () => {
    const content = "x".repeat(3000);
    const parts = splitContent(content, "index");
    // Single huge paragraph — can't split on \n\n, ends up as one part
    expect(parts.length).toBe(1);
    expect(parts[0]).toBe(content);
  });
});
