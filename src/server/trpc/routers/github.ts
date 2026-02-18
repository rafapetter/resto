import { z } from "zod/v4";
import { createRouter, tenantProcedure } from "../init";
import { GitHubClient } from "@/lib/github";
import { auditLog } from "@/server/db/schema";
import { assertAgentActions } from "@/lib/billing/gating";

export const githubRouter = createRouter({
  getUser: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const gh = await GitHubClient.fromProject(ctx.tenantId, input.projectId);
      return gh.getUser();
    }),

  listRepos: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const gh = await GitHubClient.fromProject(ctx.tenantId, input.projectId);
      return gh.listRepos();
    }),

  createRepo: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        name: z.string().min(1),
        description: z.string().optional(),
        isPrivate: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await assertAgentActions(ctx.tenantId);
      const gh = await GitHubClient.fromProject(ctx.tenantId, input.projectId);
      const repo = await gh.createRepo({
        name: input.name,
        description: input.description,
        isPrivate: input.isPrivate,
        autoInit: true,
      });

      await ctx.db.insert(auditLog).values({
        tenantId: ctx.tenantId,
        projectId: input.projectId,
        action: "github.repo_created",
        performedBy: ctx.userId,
        details: {
          repoName: repo.fullName,
          private: repo.private,
          htmlUrl: repo.htmlUrl,
        },
      });

      return repo;
    }),

  pushCode: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        owner: z.string().min(1),
        repo: z.string().min(1),
        branch: z.string().default("main"),
        commitMessage: z.string().min(1),
        files: z.array(
          z.object({
            path: z.string().min(1),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const gh = await GitHubClient.fromProject(ctx.tenantId, input.projectId);
      const result = await gh.pushMultipleFiles({
        owner: input.owner,
        repo: input.repo,
        branch: input.branch,
        message: input.commitMessage,
        files: input.files,
      });

      await ctx.db.insert(auditLog).values({
        tenantId: ctx.tenantId,
        projectId: input.projectId,
        action: "github.code_pushed",
        performedBy: ctx.userId,
        details: {
          repo: `${input.owner}/${input.repo}`,
          branch: input.branch,
          commitSha: result.commitSha,
          filesCount: input.files.length,
        },
      });

      return result;
    }),

  getRepoContents: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        owner: z.string().min(1),
        repo: z.string().min(1),
        path: z.string().default(""),
        ref: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const gh = await GitHubClient.fromProject(ctx.tenantId, input.projectId);
      return gh.getRepoContents(input.owner, input.repo, input.path, input.ref);
    }),
});
