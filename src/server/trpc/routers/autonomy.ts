import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { AutonomyChecker } from "@/lib/autonomy/checker";
import { logAuditEntry } from "@/lib/autonomy/audit";
import { tenants, projects } from "@/server/db/schema";
import { sendAutonomyDecisionEmail } from "@/lib/email/send";

const categoryEnum = z.enum([
  "knowledge_management",
  "code_generation",
  "deployment",
  "integrations",
  "communications",
  "financial",
]);

const riskEnum = z.enum(["low", "medium", "high", "critical"]);

export const autonomyRouter = createRouter({
  check: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid().optional(),
        category: categoryEnum,
        action: z.string(),
        description: z.string(),
        risk: riskEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const checker = new AutonomyChecker(ctx.tenantId, input.projectId);
      return checker.check({
        category: input.category,
        action: input.action,
        description: input.description,
        risk: input.risk,
      });
    }),

  logAction: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid().optional(),
        action: z.string(),
        details: z.record(z.string(), z.unknown()).optional(),
        performedBy: z.string().default("resto_agent"),
        outcome: z.enum(["approved", "denied"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await logAuditEntry(
        ctx.tenantId,
        input.action,
        input.performedBy,
        input.details,
        input.projectId
      );

      if (input.outcome === "approved" || input.outcome === "denied") {
        const [tenant, project] = await Promise.all([
          ctx.db.query.tenants.findFirst({ where: eq(tenants.id, ctx.tenantId) }),
          input.projectId
            ? ctx.db.query.projects.findFirst({ where: eq(projects.id, input.projectId) })
            : Promise.resolve(undefined),
        ]);
        if (tenant?.email) {
          void sendAutonomyDecisionEmail({
            to: tenant.email,
            actionType: input.action,
            decision: input.outcome,
            projectName: project?.name ?? "Unknown project",
            projectId: input.projectId ?? "",
          });
        }
      }
    }),
});
