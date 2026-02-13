import { z } from "zod/v4";
import { eq, and, isNull } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { autonomySettings } from "@/server/db/schema";

export const settingsRouter = createRouter({
  getAutonomy: tenantProcedure
    .input(z.object({ projectId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      const conditions = [eq(autonomySettings.tenantId, ctx.tenantId)];
      if (input.projectId) {
        conditions.push(eq(autonomySettings.projectId, input.projectId));
      } else {
        conditions.push(isNull(autonomySettings.projectId));
      }

      return ctx.db.query.autonomySettings.findMany({
        where: and(...conditions),
      });
    }),

  updateAutonomy: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid().optional(),
        category: z.enum([
          "knowledge_management",
          "code_generation",
          "deployment",
          "integrations",
          "communications",
          "financial",
        ]),
        level: z.enum([
          "full_auto",
          "notify_after",
          "quick_confirm",
          "detailed_approval",
          "manual_only",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Try to find existing setting
      const conditions = [
        eq(autonomySettings.tenantId, ctx.tenantId),
        eq(autonomySettings.category, input.category),
      ];
      if (input.projectId) {
        conditions.push(eq(autonomySettings.projectId, input.projectId));
      } else {
        conditions.push(isNull(autonomySettings.projectId));
      }

      const existing = await ctx.db.query.autonomySettings.findFirst({
        where: and(...conditions),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(autonomySettings)
          .set({ level: input.level })
          .where(eq(autonomySettings.id, existing.id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(autonomySettings)
        .values({
          tenantId: ctx.tenantId,
          projectId: input.projectId,
          category: input.category,
          level: input.level,
        })
        .returning();
      return created;
    }),
});
