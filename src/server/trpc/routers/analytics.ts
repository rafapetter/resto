import { z } from "zod/v4";
import { createRouter, tenantProcedure } from "../init";
import { usageRecords } from "@/server/db/schema";
import { eq, and, gte, sum, count, sql } from "drizzle-orm";

const dateRangeSchema = z.object({
  days: z.number().int().min(1).max(365).default(30),
});

export const analyticsRouter = createRouter({
  // Total cost + tokens for the tenant over N days
  summary: tenantProcedure.input(dateRangeSchema).query(async ({ ctx, input }) => {
    const since = new Date();
    since.setDate(since.getDate() - input.days);

    const [row] = await ctx.db
      .select({
        totalCostUsd: sum(usageRecords.costUsd),
        totalInputTokens: sum(usageRecords.inputTokens),
        totalOutputTokens: sum(usageRecords.outputTokens),
        totalRequests: count(),
      })
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.tenantId, ctx.tenantId),
          gte(usageRecords.createdAt, since)
        )
      );

    return {
      totalCostUsd: Number(row?.totalCostUsd ?? 0),
      totalInputTokens: Number(row?.totalInputTokens ?? 0),
      totalOutputTokens: Number(row?.totalOutputTokens ?? 0),
      totalRequests: Number(row?.totalRequests ?? 0),
    };
  }),

  // Cost per day for chart (last N days)
  costByDay: tenantProcedure.input(dateRangeSchema).query(async ({ ctx, input }) => {
    const since = new Date();
    since.setDate(since.getDate() - input.days);

    const rows = await ctx.db
      .select({
        date: sql<string>`DATE(${usageRecords.createdAt})`.as("date"),
        costUsd: sum(usageRecords.costUsd),
        requests: count(),
      })
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.tenantId, ctx.tenantId),
          gte(usageRecords.createdAt, since)
        )
      )
      .groupBy(sql`DATE(${usageRecords.createdAt})`)
      .orderBy(sql`DATE(${usageRecords.createdAt})`);

    return rows.map((r) => ({
      date: r.date,
      costUsd: Number(r.costUsd ?? 0),
      requests: Number(r.requests ?? 0),
    }));
  }),

  // Cost breakdown by model
  costByModel: tenantProcedure.input(dateRangeSchema).query(async ({ ctx, input }) => {
    const since = new Date();
    since.setDate(since.getDate() - input.days);

    const rows = await ctx.db
      .select({
        model: usageRecords.model,
        provider: usageRecords.provider,
        costUsd: sum(usageRecords.costUsd),
        requests: count(),
        inputTokens: sum(usageRecords.inputTokens),
        outputTokens: sum(usageRecords.outputTokens),
      })
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.tenantId, ctx.tenantId),
          gte(usageRecords.createdAt, since)
        )
      )
      .groupBy(usageRecords.model, usageRecords.provider)
      .orderBy(sql`SUM(${usageRecords.costUsd}) DESC`);

    return rows.map((r) => ({
      model: r.model,
      provider: r.provider,
      costUsd: Number(r.costUsd ?? 0),
      requests: Number(r.requests ?? 0),
      inputTokens: Number(r.inputTokens ?? 0),
      outputTokens: Number(r.outputTokens ?? 0),
    }));
  }),

  // Cost breakdown by task type
  costByTaskType: tenantProcedure.input(dateRangeSchema).query(async ({ ctx, input }) => {
    const since = new Date();
    since.setDate(since.getDate() - input.days);

    const rows = await ctx.db
      .select({
        taskType: usageRecords.taskType,
        costUsd: sum(usageRecords.costUsd),
        requests: count(),
      })
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.tenantId, ctx.tenantId),
          gte(usageRecords.createdAt, since)
        )
      )
      .groupBy(usageRecords.taskType)
      .orderBy(sql`SUM(${usageRecords.costUsd}) DESC`);

    return rows.map((r) => ({
      taskType: r.taskType ?? "unknown",
      costUsd: Number(r.costUsd ?? 0),
      requests: Number(r.requests ?? 0),
    }));
  }),
});
