import { db } from "@/server/db";
import { knowledgeFiles, knowledgeEmbeddings } from "@/server/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { uploadMarkdown, deleteBlob } from "./blob-storage";
import { chunkText, generateEmbeddings, generateEmbedding } from "./embeddings";
import { checkSize, splitContent } from "./size-enforcer";
import type {
  CreateKnowledgeInput,
  UpdateKnowledgeInput,
  SearchResult,
  KnowledgeTier,
} from "./types";

export class KnowledgeBaseService {
  async create(input: CreateKnowledgeInput) {
    const sizeCheck = checkSize(input.content, input.tier);

    if (sizeCheck.needsSplit) {
      const parts = splitContent(input.content, input.tier);
      const results = [];

      for (let i = 0; i < parts.length; i++) {
        const partTitle = `${input.title} (Part ${i + 1})`;
        const result = await this.createSingle({
          ...input,
          title: partTitle,
          content: parts[i],
        });
        results.push(result);
      }
      return results;
    }

    return [await this.createSingle(input)];
  }

  private async createSingle(input: CreateKnowledgeInput) {
    const path = `kb/${input.tenantId}/${input.projectId}/${input.tier}/${Date.now()}-${slugify(input.title)}.md`;
    const blobUrl = await uploadMarkdown(path, input.content);
    const lines = input.content.split("\n");

    const [file] = await db
      .insert(knowledgeFiles)
      .values({
        tenantId: input.tenantId,
        projectId: input.projectId,
        tier: input.tier,
        title: input.title,
        blobUrl,
        sizeBytes: new TextEncoder().encode(input.content).length,
        lineCount: lines.length,
        charCount: input.content.length,
      })
      .returning();

    // Generate and store embeddings
    const chunks = chunkText(input.content);
    if (chunks.length > 0) {
      const embeddings = await generateEmbeddings(chunks);

      for (let i = 0; i < chunks.length; i++) {
        await db.insert(knowledgeEmbeddings).values({
          fileId: file.id,
          chunkIndex: i,
          content: chunks[i],
          embedding: embeddings[i],
        });
      }
    }

    return file;
  }

  async update(input: UpdateKnowledgeInput) {
    const file = await db.query.knowledgeFiles.findFirst({
      where: and(
        eq(knowledgeFiles.id, input.id),
        eq(knowledgeFiles.tenantId, input.tenantId)
      ),
    });

    if (!file) throw new Error("Knowledge file not found");

    const updates: Record<string, unknown> = {};
    if (input.title) updates.title = input.title;
    if (input.tier) updates.tier = input.tier;

    if (input.content) {
      // Delete old blob and upload new
      await deleteBlob(file.blobUrl);
      const path = `kb/${input.tenantId}/${file.projectId}/${input.tier ?? file.tier}/${Date.now()}-${slugify(input.title ?? file.title)}.md`;
      updates.blobUrl = await uploadMarkdown(path, input.content);
      updates.sizeBytes = new TextEncoder().encode(input.content).length;
      updates.lineCount = input.content.split("\n").length;
      updates.charCount = input.content.length;

      // Re-generate embeddings
      await db
        .delete(knowledgeEmbeddings)
        .where(eq(knowledgeEmbeddings.fileId, file.id));

      const chunks = chunkText(input.content);
      if (chunks.length > 0) {
        const embeddings = await generateEmbeddings(chunks);
        for (let i = 0; i < chunks.length; i++) {
          await db.insert(knowledgeEmbeddings).values({
            fileId: file.id,
            chunkIndex: i,
            content: chunks[i],
            embedding: embeddings[i],
          });
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      const [updated] = await db
        .update(knowledgeFiles)
        .set(updates)
        .where(eq(knowledgeFiles.id, input.id))
        .returning();
      return updated;
    }

    return file;
  }

  async delete(id: string, tenantId: string) {
    const file = await db.query.knowledgeFiles.findFirst({
      where: and(
        eq(knowledgeFiles.id, id),
        eq(knowledgeFiles.tenantId, tenantId)
      ),
    });

    if (!file) throw new Error("Knowledge file not found");

    await deleteBlob(file.blobUrl);
    await db.delete(knowledgeFiles).where(eq(knowledgeFiles.id, id));
  }

  async search(
    projectId: string,
    tenantId: string,
    query: string,
    limit = 5
  ): Promise<SearchResult[]> {
    const queryEmbedding = await generateEmbedding(query);

    const results = await db
      .select({
        fileId: knowledgeEmbeddings.fileId,
        content: knowledgeEmbeddings.content,
        similarity: sql<number>`1 - (${knowledgeEmbeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`,
        title: knowledgeFiles.title,
        tier: knowledgeFiles.tier,
      })
      .from(knowledgeEmbeddings)
      .innerJoin(
        knowledgeFiles,
        eq(knowledgeEmbeddings.fileId, knowledgeFiles.id)
      )
      .where(
        and(
          eq(knowledgeFiles.projectId, projectId),
          eq(knowledgeFiles.tenantId, tenantId)
        )
      )
      .orderBy(
        sql`${knowledgeEmbeddings.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector`
      )
      .limit(limit);

    return results.map((r) => ({
      fileId: r.fileId,
      title: r.title,
      tier: r.tier as KnowledgeTier,
      chunkContent: r.content,
      similarity: r.similarity,
    }));
  }

  async getContextForProject(
    projectId: string,
    tenantId: string
  ): Promise<string> {
    // Load index-tier files first, then summaries
    const files = await db.query.knowledgeFiles.findMany({
      where: and(
        eq(knowledgeFiles.projectId, projectId),
        eq(knowledgeFiles.tenantId, tenantId)
      ),
      orderBy: [desc(knowledgeFiles.updatedAt)],
    });

    const indexFiles = files.filter((f) => f.tier === "index");
    const summaryFiles = files.filter((f) => f.tier === "summary");

    const parts: string[] = [];

    for (const file of [...indexFiles, ...summaryFiles].slice(0, 10)) {
      const chunks = await db.query.knowledgeEmbeddings.findMany({
        where: eq(knowledgeEmbeddings.fileId, file.id),
        orderBy: (e, { asc }) => [asc(e.chunkIndex)],
      });
      parts.push(`### ${file.title}\n${chunks.map((c) => c.content).join("\n")}`);
    }

    return parts.join("\n\n");
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
