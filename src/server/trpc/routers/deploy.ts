import { z } from "zod/v4";
import { createRouter, tenantProcedure } from "../init";
import { VercelClient } from "@/lib/vercel-deploy";
import { auditLog } from "@/server/db/schema";
import { assertAgentActions } from "@/lib/billing/gating";

export const deployRouter = createRouter({
  listProjects: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const vc = await VercelClient.fromProject(ctx.tenantId, input.projectId);
      return vc.listProjects();
    }),

  createProject: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        name: z.string().min(1),
        framework: z.string().default("nextjs"),
        githubRepo: z.string().min(1), // e.g. "owner/repo"
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertAgentActions(ctx.tenantId);
      const vc = await VercelClient.fromProject(ctx.tenantId, input.projectId);
      const project = await vc.createProject({
        name: input.name,
        framework: input.framework,
        gitRepository: {
          repo: input.githubRepo,
          type: "github",
        },
      });

      await ctx.db.insert(auditLog).values({
        tenantId: ctx.tenantId,
        projectId: input.projectId,
        action: "vercel.project_created",
        performedBy: ctx.userId,
        details: {
          vercelProjectId: project.id,
          vercelProjectName: project.name,
          framework: project.framework,
          githubRepo: input.githubRepo,
        },
      });

      return project;
    }),

  triggerDeployment: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        vercelProjectName: z.string().min(1),
        target: z.enum(["production", "preview"]).default("production"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertAgentActions(ctx.tenantId);
      const vc = await VercelClient.fromProject(ctx.tenantId, input.projectId);
      const deployment = await vc.createDeployment({
        name: input.vercelProjectName,
        target: input.target,
      });

      await ctx.db.insert(auditLog).values({
        tenantId: ctx.tenantId,
        projectId: input.projectId,
        action: "vercel.deployment_triggered",
        performedBy: ctx.userId,
        details: {
          deploymentId: deployment.id,
          vercelProjectName: input.vercelProjectName,
          target: input.target,
          url: deployment.url,
        },
      });

      return deployment;
    }),

  getDeploymentStatus: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        deploymentId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const vc = await VercelClient.fromProject(ctx.tenantId, input.projectId);
      return vc.getDeployment(input.deploymentId);
    }),
});
