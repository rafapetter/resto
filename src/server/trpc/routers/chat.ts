import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { conversations, type Message } from "@/server/db/schema";

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

  saveMessages: tenantProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        conversationId: z.string().uuid().optional(),
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
            timestamp: z.string(),
            metadata: z.record(z.string(), z.unknown()).optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.conversationId) {
        const existing = await ctx.db.query.conversations.findFirst({
          where: and(
            eq(conversations.id, input.conversationId),
            eq(conversations.tenantId, ctx.tenantId)
          ),
        });

        if (existing) {
          const [updated] = await ctx.db
            .update(conversations)
            .set({
              messages: [
                ...(existing.messages as Message[]),
                ...input.messages,
              ],
            })
            .where(eq(conversations.id, input.conversationId))
            .returning();
          return updated;
        }
      }

      const [conversation] = await ctx.db
        .insert(conversations)
        .values({
          tenantId: ctx.tenantId,
          projectId: input.projectId,
          messages: input.messages,
        })
        .returning();
      return conversation;
    }),
});
