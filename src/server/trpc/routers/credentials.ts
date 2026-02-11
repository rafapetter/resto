import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { integrationCredentials } from "@/server/db/schema";

export const credentialsRouter = createRouter({
  list: tenantProcedure
    .input(z.object({ projectId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(integrationCredentials.tenantId, ctx.tenantId),
      ];
      if (input.projectId) {
        conditions.push(
          eq(integrationCredentials.projectId, input.projectId)
        );
      }

      const creds = await ctx.db.query.integrationCredentials.findMany({
        where: and(...conditions),
      });

      // Return without encrypted data
      return creds.map((c) => ({
        id: c.id,
        provider: c.provider,
        authType: c.authType,
        status: c.status,
        expiresAt: c.expiresAt,
        createdAt: c.createdAt,
      }));
    }),

  delete: tenantProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(integrationCredentials)
        .where(
          and(
            eq(integrationCredentials.id, input.id),
            eq(integrationCredentials.tenantId, ctx.tenantId)
          )
        );
      return { success: true };
    }),
});
