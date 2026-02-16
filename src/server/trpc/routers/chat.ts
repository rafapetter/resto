import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { conversations } from "@/server/db/schema";

const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant", "system", "tool", "developer"]),
  content: z.string().optional(),
  timestamp: z.string(),
  toolCalls: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal("function"),
        function: z.object({ name: z.string(), arguments: z.string() }),
      })
    )
    .optional(),
  toolCallId: z.string().optional(),
  toolName: z.string().optional(),
  error: z.string().optional(),
  name: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const chatRouter = createRouter({
  getConversation: tenantProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.query.conversations.findFirst({
        where: and(
          eq(conversations.tenantId, ctx.tenantId),
          eq(conversations.projectId, input.projectId)
        ),
        orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
      });
      return conversation;
    }),

  saveConversation: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        messages: z.array(messageSchema),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.conversations.findFirst({
        where: and(
          eq(conversations.tenantId, ctx.tenantId),
          eq(conversations.projectId, input.projectId)
        ),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(conversations)
          .set({ messages: input.messages })
          .where(eq(conversations.id, existing.id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(conversations)
        .values({
          tenantId: ctx.tenantId,
          projectId: input.projectId,
          messages: input.messages,
        })
        .returning();
      return created;
    }),
});
