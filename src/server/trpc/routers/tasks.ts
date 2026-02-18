import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { checklistItems, tenants, projects } from "@/server/db/schema";
import { sendChecklistCompleteEmail } from "@/lib/email/send";

export const tasksRouter = createRouter({
  list: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.checklistItems.findMany({
        where: and(
          eq(checklistItems.tenantId, ctx.tenantId),
          eq(checklistItems.projectId, input.projectId)
        ),
        orderBy: (items, { asc }) => [asc(items.sortOrder)],
      });
    }),

  create: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        title: z.string().min(1),
        description: z.string().optional(),
        stage: z.enum(["plan", "build", "launch", "grow"]),
        sortOrder: z.number().int().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .insert(checklistItems)
        .values({
          tenantId: ctx.tenantId,
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          stage: input.stage,
          sortOrder: input.sortOrder ?? 0,
        })
        .returning();
      return item;
    }),

  updateStatus: tenantProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum([
          "pending",
          "in_progress",
          "blocked",
          "completed",
          "skipped",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(checklistItems)
        .set({ status: input.status })
        .where(
          and(
            eq(checklistItems.id, input.id),
            eq(checklistItems.tenantId, ctx.tenantId)
          )
        )
        .returning();

      if (input.status === "completed" && updated) {
        const [tenant, project] = await Promise.all([
          ctx.db.query.tenants.findFirst({ where: eq(tenants.id, ctx.tenantId) }),
          ctx.db.query.projects.findFirst({ where: eq(projects.id, updated.projectId) }),
        ]);
        if (tenant?.email && project) {
          void sendChecklistCompleteEmail({
            to: tenant.email,
            projectName: project.name,
            itemTitle: updated.title,
            projectId: project.id,
          });
        }
      }

      return updated;
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(checklistItems)
        .where(
          and(
            eq(checklistItems.id, input.id),
            eq(checklistItems.tenantId, ctx.tenantId)
          )
        );
      return { success: true };
    }),
});
