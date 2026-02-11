import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { knowledgeFiles } from "@/server/db/schema";

export const knowledgeBaseRouter = createRouter({
  list: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.knowledgeFiles.findMany({
        where: and(
          eq(knowledgeFiles.tenantId, ctx.tenantId),
          eq(knowledgeFiles.projectId, input.projectId)
        ),
        orderBy: (files, { desc }) => [desc(files.updatedAt)],
      });
    }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.knowledgeFiles.findFirst({
        where: and(
          eq(knowledgeFiles.id, input.id),
          eq(knowledgeFiles.tenantId, ctx.tenantId)
        ),
        with: { embeddings: true },
      });
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(knowledgeFiles)
        .where(
          and(
            eq(knowledgeFiles.id, input.id),
            eq(knowledgeFiles.tenantId, ctx.tenantId)
          )
        );
      return { success: true };
    }),
});
