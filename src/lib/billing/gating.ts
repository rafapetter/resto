import { db } from "@/server/db";
import { subscriptions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getPlan } from "./plans";
import { TRPCError } from "@trpc/server";

export async function getTenantPlan(tenantId: string) {
  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.tenantId, tenantId),
  });
  return { subscription: sub ?? null, plan: getPlan(sub?.plan ?? "free") };
}

export async function assertAgentActions(tenantId: string) {
  const { plan } = await getTenantPlan(tenantId);
  if (!plan.limits.agentActions) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "Agent code generation and deployment require a Pro or Scale plan. Upgrade at /billing.",
    });
  }
}
