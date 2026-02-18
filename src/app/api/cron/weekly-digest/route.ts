import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { tenants, usageRecords, projects, knowledgeFiles } from "@/server/db/schema";
import { eq, and, gte, sum } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { getPlan } from "@/lib/billing/plans";
import { sendWeeklyDigestEmail } from "@/lib/email/send";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!env.CRON_SECRET || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const allTenants = await db.select().from(tenants);
  let sent = 0;

  for (const tenant of allTenants) {
    if (!tenant.email) continue;

    const [tokenRow] = await db
      .select({
        totalInput: sum(usageRecords.inputTokens),
        totalOutput: sum(usageRecords.outputTokens),
      })
      .from(usageRecords)
      .where(
        and(
          eq(usageRecords.tenantId, tenant.id),
          gte(usageRecords.createdAt, startOfMonth)
        )
      );

    const projectRows = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.tenantId, tenant.id));

    const [kbRow] = await db
      .select({ totalBytes: sql<number>`COALESCE(SUM(${knowledgeFiles.sizeBytes}), 0)` })
      .from(knowledgeFiles)
      .where(eq(knowledgeFiles.tenantId, tenant.id));

    const tokensUsed =
      Number(tokenRow?.totalInput ?? 0) + Number(tokenRow?.totalOutput ?? 0);
    const projectCount = projectRows.length;
    const kbStorageMb = Number(kbRow?.totalBytes ?? 0) / (1024 * 1024);

    // Get plan from subscriptions (lazy import to avoid circular)
    const { subscriptions } = await import("@/server/db/schema");
    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.tenantId, tenant.id),
    });
    const plan = getPlan(sub?.plan ?? "free");

    void sendWeeklyDigestEmail({
      to: tenant.email,
      tenantName: tenant.name,
      plan: plan.name,
      tokensUsed,
      projectCount,
      kbStorageMb,
    });

    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
