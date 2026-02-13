import { z } from "zod/v4";
import { createRouter, tenantProcedure } from "../init";
import { AutonomyChecker } from "@/lib/autonomy/checker";
import { logAuditEntry } from "@/lib/autonomy/audit";

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
    }),
});
