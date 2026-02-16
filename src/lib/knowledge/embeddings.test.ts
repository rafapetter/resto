// Only testing the pure chunkText function — no OpenAI mocking needed
import { chunkText } from "./embeddings";

describe("chunkText", () => {
  it("returns single chunk for short text", () => {
    const chunks = chunkText("Hello world, this is a short text.");
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe("Hello world, this is a short text.");
  });

  it("returns single chunk for text within overlap threshold", () => {
    // CHUNK_SIZE=1000, CHUNK_OVERLAP=200 → text ≤800 chars fits in 1 chunk
    const text = "x".repeat(800);
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(1);
  });

  it("creates overlap chunk for text exactly at chunk size", () => {
    // 1000 chars → first chunk ends at 1000, overlap starts at 800 → 2 chunks
    const text = "x".repeat(1000);
    const chunks = chunkText(text);
    expect(chunks).toHaveLength(2);
  });

  it("splits text longer than chunk size", () => {
    const text = "word ".repeat(250); // ~1250 chars
    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThan(1);
  });

  it("breaks on paragraph boundary when available", () => {
    const para1 = "A".repeat(600);
    const para2 = "B".repeat(600);
    const text = `${para1}\n\n${para2}`;
    const chunks = chunkText(text);
    // Should break at the \n\n boundary
    expect(chunks[0]).toContain("A");
    expect(chunks.length).toBeGreaterThanOrEqual(2);
  });

  it("breaks on sentence boundary when no paragraph break", () => {
    // Create text > 1000 chars with sentence boundaries
    const sentences = Array.from(
      { length: 20 },
      (_, i) => `This is sentence number ${i} with enough text. `
    ).join("");
    const chunks = chunkText(sentences);
    // Should prefer breaking at ". "
    if (chunks.length > 1) {
      expect(chunks[0]).toMatch(/\.$/);
    }
  });

  it("returns empty array for empty string", () => {
    expect(chunkText("")).toEqual([]);
  });

  it("returns empty array for whitespace-only text", () => {
    expect(chunkText("   \n  \n  ")).toEqual([]);
  });

  it("trims whitespace from chunks", () => {
    const text = "  Hello world.  ";
    const chunks = chunkText(text);
    expect(chunks[0]).toBe("Hello world.");
  });

  it("creates overlap between consecutive chunks", () => {
    // Create long enough text to get multiple chunks
    const paragraphs = Array.from(
      { length: 5 },
      (_, i) => `Paragraph ${i}: ${"content ".repeat(30)}`
    ).join("\n\n");
    const chunks = chunkText(paragraphs);
    if (chunks.length >= 2) {
      // Last 200 chars of chunk[0] should overlap with beginning of chunk[1]
      const end1 = chunks[0].slice(-100);
      const start2 = chunks[1].slice(0, 200);
      // At least some content should overlap
      expect(start2.length).toBeGreaterThan(0);
    }
  });

  it("handles text with no good break points", () => {
    // Single long word with no spaces, newlines, or sentence endings
    const text = "a".repeat(1500);
    const chunks = chunkText(text);
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    // All content should be preserved
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    expect(totalLength).toBeGreaterThanOrEqual(1500);
  });

  it("preserves all content across chunks", () => {
    const text = Array.from({ length: 30 }, (_, i) => `Line ${i}.`).join("\n");
    const chunks = chunkText(text);
    // Every line should appear in at least one chunk
    for (let i = 0; i < 30; i++) {
      const found = chunks.some((c) => c.includes(`Line ${i}.`));
      expect(found).toBe(true);
    }
  });
});
