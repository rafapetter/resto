import { z } from "zod/v4";
import { createRouter, tenantProcedure } from "../init";
import { generateCode } from "@/lib/codegen";
import { KnowledgeBaseService } from "@/lib/knowledge/service";
import { auditLog, usageRecords } from "@/server/db/schema";

export const codegenRouter = createRouter({
  generate: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        description: z.string().min(1),
        framework: z.string().default("nextjs"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Run Claude Agent SDK code generation
      const result = await generateCode({
        projectId: input.projectId,
        tenantId: ctx.tenantId,
        description: input.description,
        framework: input.framework,
      });

      // 2. Store summary in knowledge base
      try {
        const kbService = new KnowledgeBaseService();
        await kbService.create({
          tenantId: ctx.tenantId,
          projectId: input.projectId,
          tier: "summary",
          title: `Code Generation: ${input.description.slice(0, 60)}`,
          content: [
            `## Code Generation Summary`,
            ``,
            `**Request:** ${input.description}`,
            `**Framework:** ${input.framework}`,
            `**Files generated:** ${result.files.length}`,
            ``,
            `### Generated Files`,
            ...result.files.map((f) => `- \`${f.path}\``),
            ``,
            `### Agent Summary`,
            result.summary,
          ].join("\n"),
        });
      } catch {
        // KB storage is best-effort; don't fail the mutation
      }

      // 3. Track LLM usage
      try {
        await ctx.db.insert(usageRecords).values({
          tenantId: ctx.tenantId,
          projectId: input.projectId,
          model: "claude-sonnet-4-5-20250929",
          provider: "anthropic",
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
          costUsd: result.cost.toFixed(6),
          taskType: "code_generation",
        });
      } catch {
        // Usage tracking is best-effort
      }

      // 4. Audit log
      await ctx.db.insert(auditLog).values({
        tenantId: ctx.tenantId,
        projectId: input.projectId,
        action: "codegen.generated",
        performedBy: ctx.userId,
        details: {
          description: input.description,
          framework: input.framework,
          filesCount: result.files.length,
          filePaths: result.files.map((f) => f.path),
          cost: result.cost,
        },
      });

      // 5. Return files + summary
      return {
        files: result.files,
        summary: result.summary,
        filesCount: result.files.length,
        cost: result.cost,
      };
    }),
});
