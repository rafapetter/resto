import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { projects } from "./projects";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "tool" | "developer";
  content?: string;
  timestamp: string;
  // Tool calls (assistant messages)
  toolCalls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  // Tool results (tool messages)
  toolCallId?: string;
  toolName?: string;
  error?: string;
  // Optional
  name?: string;
  metadata?: Record<string, unknown>;
};

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  messages: jsonb("messages").$type<Message[]>().default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
