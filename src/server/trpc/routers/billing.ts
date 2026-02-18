import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { eq, and, gte, sum } from "drizzle-orm";
import { createRouter, tenantProcedure } from "../init";
import { subscriptions, tenants, projects, usageRecords } from "@/server/db/schema";
import { PLANS, getPlan } from "@/lib/billing/plans";
import {
  createOrGetCustomer,
  createCheckoutSession,
  createPortalSession,
} from "@/lib/billing/stripe";
import { env } from "@/lib/env";

export const billingRouter = createRouter({
  // Current subscription + plan info (auto-creates free subscription if none)
  getSubscription: tenantProcedure.query(async ({ ctx }) => {
    let sub = await ctx.db.query.subscriptions.findFirst({
      where: eq(subscriptions.tenantId, ctx.tenantId),
    });

    if (!sub) {
      const [created] = await ctx.db
        .insert(subscriptions)
        .values({ tenantId: ctx.tenantId })
        .returning();
      sub = created;
    }

    return { subscription: sub!, plan: getPlan(sub!.plan) };
  }),

  // All plan definitions (for upgrade UI)
  listPlans: tenantProcedure.query(() => {
    return Object.values(PLANS);
  }),

  // Current month token usage + project count
  getUsage: tenantProcedure.query(async ({ ctx }) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [tokenRow] = await ctx.db
      .select({
        totalTokens: sum(usageRecords.inputTokens),
        totalOutputTokens: sum(usageRecords.outputTokens),
      })
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.tenantId, ctx.tenantId),
          gte(usageRecords.createdAt, startOfMonth)
        )
      );

    const projectRows = await ctx.db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.tenantId, ctx.tenantId));

    // KB storage (sum of all knowledge files)
    const { knowledgeFiles } = await import("@/server/db/schema");
    const { sql } = await import("drizzle-orm");
    const [kbRow] = await ctx.db
      .select({ totalBytes: sql<number>`COALESCE(SUM(${knowledgeFiles.sizeBytes}), 0)` })
      .from(knowledgeFiles)
      .where(eq(knowledgeFiles.tenantId, ctx.tenantId));

    return {
      tokensUsed: Number(tokenRow?.totalTokens ?? 0) + Number(tokenRow?.totalOutputTokens ?? 0),
      projectCount: projectRows.length,
      kbStorageBytes: Number(kbRow?.totalBytes ?? 0),
    };
  }),

  // Create Stripe Checkout session → returns redirect URL
  createCheckoutSession: tenantProcedure
    .input(z.object({ plan: z.enum(["pro", "scale"]) }))
    .mutation(async ({ ctx, input }) => {
      if (!env.STRIPE_SECRET_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not configured. Contact support.",
        });
      }

      const stripePriceId =
        input.plan === "pro" ? env.STRIPE_PRO_PRICE_ID : env.STRIPE_SCALE_PRICE_ID;

      if (!stripePriceId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Stripe price ID for ${input.plan} plan is not configured.`,
        });
      }

      const tenant = await ctx.db.query.tenants.findFirst({
        where: eq(tenants.id, ctx.tenantId),
      });
      if (!tenant) throw new TRPCError({ code: "FORBIDDEN" });

      let sub = await ctx.db.query.subscriptions.findFirst({
        where: eq(subscriptions.tenantId, ctx.tenantId),
      });

      // Create or retrieve Stripe customer
      const stripeCustomerId = await createOrGetCustomer(
        ctx.tenantId,
        tenant.email,
        sub?.stripeCustomerId
      );

      // Persist stripeCustomerId
      if (!sub) {
        [sub] = await ctx.db
          .insert(subscriptions)
          .values({ tenantId: ctx.tenantId, stripeCustomerId })
          .returning();
      } else if (!sub.stripeCustomerId) {
        await ctx.db
          .update(subscriptions)
          .set({ stripeCustomerId, updatedAt: new Date() })
          .where(eq(subscriptions.tenantId, ctx.tenantId));
      }

      const appUrl = env.NEXT_PUBLIC_APP_URL;
      const url = await createCheckoutSession({
        tenantId: ctx.tenantId,
        stripeCustomerId,
        stripePriceId,
        successUrl: `${appUrl}/billing?success=true`,
        cancelUrl: `${appUrl}/billing`,
      });

      return { url };
    }),

  // Create Stripe Customer Portal session → returns redirect URL
  createPortalSession: tenantProcedure.mutation(async ({ ctx }) => {
    const sub = await ctx.db.query.subscriptions.findFirst({
      where: eq(subscriptions.tenantId, ctx.tenantId),
    });

    if (!sub?.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No billing account found. Please upgrade first.",
      });
    }

    const url = await createPortalSession(
      sub.stripeCustomerId,
      `${env.NEXT_PUBLIC_APP_URL}/billing`
    );

    return { url };
  }),
});
