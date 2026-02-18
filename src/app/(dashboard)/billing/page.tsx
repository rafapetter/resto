"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, CreditCard, Zap, FolderKanban, Database } from "lucide-react";
import { PLANS, formatLimit, isUnlimited } from "@/lib/billing/plans";
import type { Plan } from "@/lib/billing/plans";

function UsageBar({
  label,
  used,
  limit,
  icon: Icon,
  formatUsed,
}: {
  label: string;
  used: number;
  limit: number;
  icon: React.ElementType;
  formatUsed: (n: number) => string;
}) {
  const unlimited = isUnlimited(limit);
  const pct = unlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isWarning = !unlimited && pct >= 80;
  const isCritical = !unlimited && pct >= 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {label}
        </span>
        <span className="text-muted-foreground">
          {formatUsed(used)} / {unlimited ? "∞" : formatUsed(limit)}
        </span>
      </div>
      {!unlimited && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${
              isCritical
                ? "bg-destructive"
                : isWarning
                  ? "bg-yellow-500"
                  : "bg-primary"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

function PlanBadge({ planId }: { planId: string }) {
  const colors: Record<string, string> = {
    free: "bg-muted text-muted-foreground",
    pro: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    scale: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[planId] ?? colors.free}`}
    >
      {PLANS[planId as keyof typeof PLANS]?.name ?? "Free"}
    </span>
  );
}

function PlanCard({
  plan,
  currentPlanId,
  onUpgrade,
}: {
  plan: Plan;
  currentPlanId: string;
  onUpgrade: (planId: "pro" | "scale") => void;
}) {
  const isCurrent = plan.id === currentPlanId;
  const canUpgrade = plan.id !== "free" && !isCurrent;

  return (
    <Card className={isCurrent ? "border-primary ring-1 ring-primary" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{plan.name}</CardTitle>
          {isCurrent && <Badge variant="outline">Current plan</Badge>}
        </div>
        <p className="text-2xl font-bold">
          {plan.priceMonthly === 0 ? (
            "Free"
          ) : (
            <>
              ${plan.priceMonthly}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </>
          )}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1.5 text-sm">
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            {formatLimit(plan.limits.projects, "projects")} project
            {plan.limits.projects !== 1 && "s"}
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            {formatLimit(plan.limits.tokensPerMonth, "tokens")} tokens/mo
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            {formatLimit(plan.limits.kbStorageMb, "MB")} KB storage
          </li>
          <li className="flex items-center gap-2">
            <Check
              className={`h-3.5 w-3.5 shrink-0 ${plan.limits.agentActions ? "text-primary" : "text-muted-foreground"}`}
            />
            <span className={plan.limits.agentActions ? "" : "text-muted-foreground"}>
              Code gen &amp; deployment
            </span>
          </li>
        </ul>
        {canUpgrade && (
          <Button
            className="w-full"
            onClick={() => onUpgrade(plan.id as "pro" | "scale")}
          >
            Upgrade to {plan.name}
          </Button>
        )}
        {isCurrent && plan.id === "free" && (
          <p className="text-center text-xs text-muted-foreground">
            Upgrade to unlock more features
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SuccessHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated! Welcome to your new plan.");
      router.replace("/billing");
    }
  }, [searchParams, router]);
  return null;
}

export default function BillingPage() {
  const router = useRouter();
  const trpc = useTRPC();

  const subQ = useQuery(trpc.billing.getSubscription.queryOptions());
  const usageQ = useQuery(trpc.billing.getUsage.queryOptions());

  const checkoutMut = useMutation(
    trpc.billing.createCheckoutSession.mutationOptions({
      onSuccess: ({ url }) => router.push(url),
      onError: (err) => toast.error("Checkout failed", { description: err.message }),
    })
  );

  const portalMut = useMutation(
    trpc.billing.createPortalSession.mutationOptions({
      onSuccess: ({ url }) => router.push(url),
      onError: (err) => toast.error("Could not open portal", { description: err.message }),
    })
  );

  const sub = subQ.data;
  const plan = sub?.plan;
  const usage = usageQ.data;

  const kbMb = (usage?.kbStorageBytes ?? 0) / (1024 * 1024);

  return (
    <div>
      <Suspense fallback={null}>
        <SuccessHandler />
      </Suspense>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and usage.
        </p>
      </div>

      {/* Current plan summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subQ.isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              {sub && <PlanBadge planId={sub.subscription.plan} />}
              {sub?.subscription.currentPeriodEnd && (
                <span className="text-sm text-muted-foreground">
                  Renews{" "}
                  {new Date(sub.subscription.currentPeriodEnd).toLocaleDateString()}
                  {sub.subscription.cancelAtPeriodEnd && " (cancels at period end)"}
                </span>
              )}
              <div className="ml-auto flex gap-2">
                {sub?.subscription.plan !== "free" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => portalMut.mutate()}
                    disabled={portalMut.isPending}
                  >
                    Manage subscription
                  </Button>
                )}
                {sub?.subscription.plan !== "scale" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      const targetPlan = sub?.subscription.plan === "pro" ? "scale" : "pro";
                      checkoutMut.mutate({ plan: targetPlan });
                    }}
                    disabled={checkoutMut.isPending}
                  >
                    {checkoutMut.isPending ? "Loading…" : sub?.subscription.plan === "pro" ? "Upgrade to Scale" : "Upgrade to Pro"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage bars */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4" />
            Usage this month
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {usageQ.isLoading || !plan ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <UsageBar
                label="Projects"
                used={usage?.projectCount ?? 0}
                limit={plan.limits.projects}
                icon={FolderKanban}
                formatUsed={(n) => String(n)}
              />
              <UsageBar
                label="LLM tokens"
                used={usage?.tokensUsed ?? 0}
                limit={plan.limits.tokensPerMonth}
                icon={Zap}
                formatUsed={(n) =>
                  n >= 1_000_000
                    ? `${(n / 1_000_000).toFixed(1)}M`
                    : n >= 1_000
                      ? `${(n / 1_000).toFixed(0)}K`
                      : String(n)
                }
              />
              <UsageBar
                label="KB storage"
                used={kbMb}
                limit={plan.limits.kbStorageMb}
                icon={Database}
                formatUsed={(n) => `${n.toFixed(1)} MB`}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Plan comparison */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Plans</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.values(PLANS).map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              currentPlanId={sub?.subscription.plan ?? "free"}
              onUpgrade={(planId) => checkoutMut.mutate({ plan: planId })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
