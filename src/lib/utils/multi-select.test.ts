import {
  EMPTY_MULTI_SELECT,
  hasMultiSelectContent,
  resolveMultiSelect,
} from "./multi-select";

describe("hasMultiSelectContent", () => {
  it("returns false for EMPTY_MULTI_SELECT", () => {
    expect(hasMultiSelectContent(EMPTY_MULTI_SELECT)).toBe(false);
  });

  it("returns false for empty selected and empty custom", () => {
    expect(hasMultiSelectContent({ selected: [], custom: "" })).toBe(false);
  });

  it("returns false for empty selected and whitespace-only custom", () => {
    expect(hasMultiSelectContent({ selected: [], custom: "   " })).toBe(false);
  });

  it("returns true when selected is non-empty", () => {
    expect(hasMultiSelectContent({ selected: ["a"], custom: "" })).toBe(true);
  });

  it("returns true when custom has text", () => {
    expect(hasMultiSelectContent({ selected: [], custom: "foo" })).toBe(true);
  });

  it("returns true when both selected and custom have content", () => {
    expect(hasMultiSelectContent({ selected: ["a"], custom: "bar" })).toBe(
      true
    );
  });
});

describe("resolveMultiSelect", () => {
  it("resolves selected IDs using optionMap", () => {
    const result = resolveMultiSelect(
      { selected: ["a", "b"], custom: "" },
      { a: "Alpha", b: "Beta" }
    );
    expect(result).toBe("Alpha, Beta");
  });

  it("falls back to raw ID when not in optionMap", () => {
    const result = resolveMultiSelect(
      { selected: ["unknown-id"], custom: "" },
      {}
    );
    expect(result).toBe("unknown-id");
  });

  it("appends trimmed custom value", () => {
    const result = resolveMultiSelect(
      { selected: [], custom: "  custom text  " },
      {}
    );
    expect(result).toBe("custom text");
  });

  it("combines selected labels and custom, comma-separated", () => {
    const result = resolveMultiSelect(
      { selected: ["a"], custom: "extra" },
      { a: "Alpha" }
    );
    expect(result).toBe("Alpha, extra");
  });

  it("returns empty string for empty value with empty optionMap", () => {
    const result = resolveMultiSelect(EMPTY_MULTI_SELECT, {});
    expect(result).toBe("");
  });
});
