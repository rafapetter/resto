import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { projects } from "./projects";
import { knowledgeTier } from "./enums";

export const knowledgeFiles = pgTable("knowledge_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  tier: knowledgeTier("tier").notNull(),
  title: text("title").notNull(),
  blobUrl: text("blob_url").notNull(),
  sizeBytes: integer("size_bytes").default(0).notNull(),
  lineCount: integer("line_count").default(0).notNull(),
  charCount: integer("char_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const knowledgeEmbeddings = pgTable("knowledge_embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  fileId: uuid("file_id")
    .notNull()
    .references(() => knowledgeFiles.id, { onDelete: "cascade" }),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
