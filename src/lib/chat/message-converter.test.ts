import { convertAguiToDb, convertDbToAgui } from "./message-converter";
import type { Message as DbMessage } from "@/server/db/schema/conversations";

// Helper: create minimal AG-UI-shaped message objects
function aguiMsg(overrides: Record<string, unknown>) {
  return { id: "msg-1", ...overrides } as any;
}

const ISO_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

describe("convertAguiToDb", () => {
  it("converts user message with string content", () => {
    const result = convertAguiToDb([
      aguiMsg({ role: "user", content: "hello" }),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("user");
    expect(result[0].content).toBe("hello");
  });

  it("converts user message with object content (stringifies)", () => {
    const content = [{ type: "text", text: "hi" }];
    const result = convertAguiToDb([aguiMsg({ role: "user", content })]);
    expect(result[0].content).toBe(JSON.stringify(content));
  });

  it("converts assistant message with content", () => {
    const result = convertAguiToDb([
      aguiMsg({ role: "assistant", content: "response" }),
    ]);
    expect(result[0].role).toBe("assistant");
    expect(result[0].content).toBe("response");
  });

  it("converts assistant message with toolCalls", () => {
    const toolCalls = [
      { id: "tc-1", type: "function", function: { name: "fn", arguments: "{}" } },
    ];
    const result = convertAguiToDb([
      aguiMsg({ role: "assistant", content: "", toolCalls }),
    ]);
    expect(result[0].toolCalls).toEqual(toolCalls);
  });

  it("converts tool message with content, toolCallId, toolName", () => {
    const result = convertAguiToDb([
      aguiMsg({
        role: "tool",
        content: "result",
        toolCallId: "tc-1",
        toolName: "myTool",
      }),
    ]);
    expect(result[0].role).toBe("tool");
    expect(result[0].content).toBe("result");
    expect(result[0].toolCallId).toBe("tc-1");
    expect(result[0].toolName).toBe("myTool");
  });

  it("converts tool message with error field", () => {
    const result = convertAguiToDb([
      aguiMsg({
        role: "tool",
        content: "",
        toolCallId: "tc-1",
        error: "something failed",
      }),
    ]);
    expect(result[0].error).toBe("something failed");
  });

  it("converts system message", () => {
    const result = convertAguiToDb([
      aguiMsg({ role: "system", content: "system prompt" }),
    ]);
    expect(result[0].role).toBe("system");
    expect(result[0].content).toBe("system prompt");
  });

  it("converts developer message", () => {
    const result = convertAguiToDb([
      aguiMsg({ role: "developer", content: "dev note" }),
    ]);
    expect(result[0].role).toBe("developer");
    expect(result[0].content).toBe("dev note");
  });

  it("filters out activity messages", () => {
    const result = convertAguiToDb([
      aguiMsg({ role: "activity", content: "loading..." }),
      aguiMsg({ role: "user", content: "hello" }),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe("user");
  });

  it("preserves message id", () => {
    const result = convertAguiToDb([
      aguiMsg({ id: "custom-id", role: "user", content: "hi" }),
    ]);
    expect(result[0].id).toBe("custom-id");
  });

  it("sets timestamp as valid ISO string", () => {
    const result = convertAguiToDb([
      aguiMsg({ role: "user", content: "hi" }),
    ]);
    expect(result[0].timestamp).toMatch(ISO_REGEX);
  });

  it("preserves name field when present", () => {
    const result = convertAguiToDb([
      aguiMsg({ role: "user", content: "hi", name: "user1" }),
    ]);
    expect(result[0].name).toBe("user1");
  });
});

describe("convertDbToAgui", () => {
  it("converts user message back to AGUI format", () => {
    const db: DbMessage[] = [
      { id: "1", role: "user", content: "hello", timestamp: "2024-01-01T00:00:00Z" },
    ];
    const result = convertDbToAgui(db);
    expect(result[0]).toEqual({ id: "1", role: "user", content: "hello" });
  });

  it("converts assistant message with content and toolCalls", () => {
    const toolCalls = [
      { id: "tc-1", type: "function" as const, function: { name: "fn", arguments: "{}" } },
    ];
    const db: DbMessage[] = [
      {
        id: "1",
        role: "assistant",
        content: "sure",
        toolCalls,
        timestamp: "2024-01-01T00:00:00Z",
      },
    ];
    const result = convertDbToAgui(db);
    expect(result[0].role).toBe("assistant");
    expect((result[0] as any).content).toBe("sure");
    expect((result[0] as any).toolCalls).toEqual(toolCalls);
  });

  it("converts tool message with all fields", () => {
    const db: DbMessage[] = [
      {
        id: "1",
        role: "tool",
        content: "output",
        toolCallId: "tc-1",
        toolName: "myTool",
        error: "err",
        timestamp: "2024-01-01T00:00:00Z",
      },
    ];
    const result = convertDbToAgui(db);
    expect(result[0].role).toBe("tool");
    expect((result[0] as any).toolCallId).toBe("tc-1");
    expect((result[0] as any).toolName).toBe("myTool");
    expect((result[0] as any).error).toBe("err");
  });

  it("converts system message", () => {
    const db: DbMessage[] = [
      { id: "1", role: "system", content: "sys", timestamp: "2024-01-01T00:00:00Z" },
    ];
    const result = convertDbToAgui(db);
    expect(result[0]).toEqual({ id: "1", role: "system", content: "sys" });
  });

  it("converts developer message", () => {
    const db: DbMessage[] = [
      { id: "1", role: "developer", content: "dev", timestamp: "2024-01-01T00:00:00Z" },
    ];
    const result = convertDbToAgui(db);
    expect(result[0]).toEqual({ id: "1", role: "developer", content: "dev" });
  });

  it("handles null/undefined content gracefully", () => {
    const db: DbMessage[] = [
      { id: "1", role: "user", timestamp: "2024-01-01T00:00:00Z" },
    ];
    const result = convertDbToAgui(db);
    expect((result[0] as any).content).toBe("");
  });
});
