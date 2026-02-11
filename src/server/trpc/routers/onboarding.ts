import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { onboardingProgress } from "@/server/db/schema";

export const onboardingRouter = createRouter({
  getProgress: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.onboardingProgress.findMany({
        where: and(
          eq(onboardingProgress.tenantId, ctx.tenantId),
          eq(onboardingProgress.projectId, input.projectId)
        ),
        orderBy: (progress, { asc }) => [asc(progress.createdAt)],
      });
    }),

  updateStep: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        step: z.enum([
          "welcome",
          "business_info",
          "template_selection",
          "integrations",
          "review",
          "complete",
        ]),
        data: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [progress] = await ctx.db
        .insert(onboardingProgress)
        .values({
          tenantId: ctx.tenantId,
          projectId: input.projectId,
          step: input.step,
          data: input.data,
          completedAt: new Date(),
        })
        .returning();
      return progress;
    }),
});
