import type { Message as AguiMessage } from "@copilotkit/shared";
import type { Message as DbMessage } from "@/server/db/schema/conversations";

/**
 * Convert CopilotKit AG-UI messages to DB-storable format.
 * Strips non-serializable fields (generativeUI, state, image) and skips activity messages.
 */
export function convertAguiToDb(messages: AguiMessage[]): DbMessage[] {
  return messages
    .filter((m) => m.role !== "activity")
    .map((m): DbMessage => {
      const base: DbMessage = {
        id: m.id,
        role: m.role as DbMessage["role"],
        timestamp: new Date().toISOString(),
      };

      switch (m.role) {
        case "user":
          base.content =
            typeof m.content === "string"
              ? m.content
              : JSON.stringify(m.content);
          break;
        case "assistant":
          if (m.content) base.content = m.content;
          if (m.toolCalls?.length) base.toolCalls = m.toolCalls;
          break;
        case "tool":
          base.content = m.content;
          base.toolCallId = m.toolCallId;
          if ("toolName" in m && m.toolName)
            base.toolName = m.toolName as string;
          if (m.error) base.error = m.error;
          break;
        case "system":
        case "developer":
          base.content = m.content;
          break;
      }

      if ("name" in m && m.name) base.name = m.name;
      return base;
    });
}

/**
 * Convert DB messages back to CopilotKit AG-UI format for restoring into chat.
 */
export function convertDbToAgui(messages: DbMessage[]): AguiMessage[] {
  return messages.map((m): AguiMessage => {
    switch (m.role) {
      case "user":
        return { id: m.id, role: "user" as const, content: m.content ?? "" };
      case "assistant":
        return {
          id: m.id,
          role: "assistant" as const,
          ...(m.content != null ? { content: m.content } : {}),
          ...(m.toolCalls ? { toolCalls: m.toolCalls } : {}),
        };
      case "tool":
        return {
          id: m.id,
          role: "tool" as const,
          content: m.content ?? "",
          toolCallId: m.toolCallId ?? "",
          ...(m.toolName ? { toolName: m.toolName } : {}),
          ...(m.error ? { error: m.error } : {}),
        };
      case "system":
        return {
          id: m.id,
          role: "system" as const,
          content: m.content ?? "",
        };
      case "developer":
        return {
          id: m.id,
          role: "developer" as const,
          content: m.content ?? "",
        };
    }
  });
}
