import { z } from "zod/v4";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, tenantProcedure } from "../init";
import { knowledgeFiles } from "@/server/db/schema";
import { KnowledgeBaseService } from "@/lib/knowledge/service";
import { getTenantPlan } from "@/lib/billing/gating";

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

  search: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        query: z.string().min(1),
        limit: z.number().int().min(1).max(20).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const kb = new KnowledgeBaseService();
      return kb.search(
        input.projectId,
        ctx.tenantId,
        input.query,
        input.limit ?? 5,
      );
    }),

  create: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        title: z.string().min(1),
        content: z.string().min(1),
        tier: z.enum(["index", "summary", "detail"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check plan KB storage limit
      const { plan } = await getTenantPlan(ctx.tenantId);
      if (plan.limits.kbStorageMb !== -1) {
        const [row] = await ctx.db
          .select({
            totalBytes: sql<number>`COALESCE(SUM(${knowledgeFiles.sizeBytes}), 0)`,
          })
          .from(knowledgeFiles)
          .where(eq(knowledgeFiles.tenantId, ctx.tenantId));
        const totalMb = Number(row?.totalBytes ?? 0) / (1024 * 1024);
        if (totalMb >= plan.limits.kbStorageMb) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Knowledge base storage limit (${plan.limits.kbStorageMb}MB) reached. Upgrade at /billing.`,
          });
        }
      }

      const kb = new KnowledgeBaseService();
      return kb.create({
        tenantId: ctx.tenantId,
        projectId: input.projectId,
        tier: input.tier,
        title: input.title,
        content: input.content,
      });
    }),
});
