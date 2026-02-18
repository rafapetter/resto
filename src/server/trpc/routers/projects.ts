import { z } from "zod/v4";
import { eq, and, asc, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createRouter, tenantProcedure } from "../init";
import {
  projects,
  checklistItems,
  autonomySettings,
  integrationCredentials,
} from "@/server/db/schema";
import { KnowledgeBaseService } from "@/lib/knowledge/service";
import { bootstrapProject } from "@/lib/agent/bootstrap/project-bootstrap";
import type { AutonomyCategory, ApprovalLevel } from "@/lib/autonomy/types";
import { getTenantPlan } from "@/lib/billing/gating";

// ─── Zod schema for MultiSelectValue ────────────────────────────────

const multiSelectValueSchema = z.object({
  selected: z.array(z.string()),
  custom: z.string(),
});

// ─── Router ─────────────────────────────────────────────────────────

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
      // Check plan project limit
      const { plan } = await getTenantPlan(ctx.tenantId);
      if (plan.limits.projects !== -1) {
        const [row] = await ctx.db
          .select({ count: sql<number>`COUNT(*)` })
          .from(projects)
          .where(eq(projects.tenantId, ctx.tenantId));
        if (Number(row?.count ?? 0) >= plan.limits.projects) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Your ${plan.name} plan allows ${plan.limits.projects} project. Upgrade at /billing to create more.`,
          });
        }
      }

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

  // ─── Bootstrap: seed KB + generate checklist ────────────────────

  bootstrap: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        template: z.object({
          industryId: z.string().nullable(),
          verticalId: z.string().nullable(),
          productIds: z.array(z.string()),
        }),
        businessInfo: z.object({
          businessName: z.string(),
          industry: multiSelectValueSchema,
          problemStatement: multiSelectValueSchema,
          solution: multiSelectValueSchema,
          targetCustomer: multiSelectValueSchema,
          revenueModels: z.array(z.string()),
        }),
        autonomyPreferences: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return bootstrapProject({
        projectId: input.projectId,
        tenantId: ctx.tenantId,
        template: input.template,
        businessInfo: input.businessInfo,
        autonomyPreferences:
          input.autonomyPreferences as Record<AutonomyCategory, ApprovalLevel>,
      });
    }),

  // ─── Full context for chat page ─────────────────────────────────

  getFullContext: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [project, checklist, autonomy, credentials] = await Promise.all([
        ctx.db.query.projects.findFirst({
          where: and(
            eq(projects.id, input.projectId),
            eq(projects.tenantId, ctx.tenantId)
          ),
        }),
        ctx.db.query.checklistItems.findMany({
          where: and(
            eq(checklistItems.projectId, input.projectId),
            eq(checklistItems.tenantId, ctx.tenantId)
          ),
          orderBy: [asc(checklistItems.sortOrder)],
        }),
        ctx.db.query.autonomySettings.findMany({
          where: and(
            eq(autonomySettings.projectId, input.projectId),
            eq(autonomySettings.tenantId, ctx.tenantId)
          ),
        }),
        ctx.db.query.integrationCredentials.findMany({
          where: and(
            eq(integrationCredentials.projectId, input.projectId),
            eq(integrationCredentials.tenantId, ctx.tenantId)
          ),
        }),
      ]);

      // Load KB context (index + summary tier file contents)
      const kb = new KnowledgeBaseService();
      const knowledgeContext = await kb.getContextForProject(
        input.projectId,
        ctx.tenantId,
      );

      // Derive current stage: earliest stage with incomplete items
      const stages = ["plan", "build", "launch", "grow"] as const;
      let currentStage: string | null = null;
      for (const stage of stages) {
        const stageItems = checklist.filter((i) => i.stage === stage);
        const hasIncomplete = stageItems.some(
          (i) => i.status !== "completed" && i.status !== "skipped"
        );
        if (hasIncomplete) {
          currentStage = stage;
          break;
        }
      }

      return {
        project,
        checklist,
        autonomy,
        knowledgeContext,
        currentStage,
        integrations: credentials.map((c) => ({
          provider: c.provider,
          status: c.status,
          accountLabel: c.accountLabel,
        })),
      };
    }),
});
