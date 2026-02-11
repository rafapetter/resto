import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { projects } from "@/server/db/schema";

export const projectsRouter = createRouter({
  list: tenantProcedure.query(async ({ ctx }) => {
    return ctx.db.query.projects.findMany({
      where: eq(projects.tenantId, ctx.tenantId),
      orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    });
  }),

  getById: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.projects.findFirst({
        where: and(
          eq(projects.id, input.id),
          eq(projects.tenantId, ctx.tenantId)
        ),
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        templateId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .insert(projects)
        .values({
          tenantId: ctx.tenantId,
          name: input.name,
          description: input.description,
          templateId: input.templateId,
          status: "draft",
        })
        .returning();
      return project;
    }),

  update: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        status: z
          .enum(["draft", "onboarding", "active", "paused", "archived"])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(projects)
        .set(data)
        .where(
          and(eq(projects.id, id), eq(projects.tenantId, ctx.tenantId))
        )
        .returning();
      return updated;
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(projects)
        .where(
          and(
            eq(projects.id, input.id),
            eq(projects.tenantId, ctx.tenantId)
          )
        );
      return { success: true };
    }),
});
