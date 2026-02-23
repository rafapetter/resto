import { Check, X } from "lucide-react";
import Link from "next/link";
import { PLANS, formatLimit, isUnlimited } from "@/lib/billing/plans";
import type { Plan } from "@/lib/billing/plans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Resto. Start free, scale when you're ready.",
};

function PlanCard({ plan, popular }: { plan: Plan; popular?: boolean }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        popular
          ? "border-primary bg-primary/[0.02] shadow-lg ring-1 ring-primary"
          : "border-border"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
          Most Popular
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <div className="mt-2">
          {plan.priceMonthly === 0 ? (
            <span className="text-4xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold">${plan.priceMonthly}</span>
              <span className="text-muted-foreground">/month</span>
            </>
          )}
        </div>
      </div>

      <ul className="mb-8 flex-1 space-y-3 text-sm">
        <li className="flex items-center gap-2.5">
          <Check className="h-4 w-4 shrink-0 text-primary" />
          {formatLimit(plan.limits.projects, "projects")}{" "}
          {isUnlimited(plan.limits.projects)
            ? ""
            : plan.limits.projects === 1
              ? "project"
              : "projects"}
        </li>
        <li className="flex items-center gap-2.5">
          <Check className="h-4 w-4 shrink-0 text-primary" />
          {formatLimit(plan.limits.tokensPerMonth, "tokens")} tokens/month
        </li>
        <li className="flex items-center gap-2.5">
          <Check className="h-4 w-4 shrink-0 text-primary" />
          {formatLimit(plan.limits.kbStorageMb, "MB")} knowledge base
        </li>
        <li className="flex items-center gap-2.5">
          {plan.limits.agentActions ? (
            <Check className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <X className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className={plan.limits.agentActions ? "" : "text-muted-foreground"}>
            Agent actions & code generation
          </span>
        </li>
        {plan.id === "scale" && (
          <li className="flex items-center gap-2.5">
            <Check className="h-4 w-4 shrink-0 text-primary" />
            Priority support
          </li>
        )}
      </ul>

      <Link
        href="/sign-up"
        className={`inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium transition-colors ${
          popular
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-border bg-background hover:bg-accent"
        }`}
      >
        {plan.priceMonthly === 0 ? "Get Started Free" : `Start ${plan.name}`}
      </Link>
    </div>
  );
}

export default function PricingPage() {
  const plans = Object.values(PLANS);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold">
            Resto
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Pricing Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Start free. Scale when you're ready. No hidden fees.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                popular={plan.id === "pro"}
              />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            All plans include multi-model AI routing, persistent memory, and
            voice interaction. Courses are priced separately.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ATR - All The Rest
        </p>
      </footer>
    </div>
  );
}
