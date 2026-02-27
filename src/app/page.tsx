/* All navigation on this page uses plain <a> tags instead of next/link
   because the root layout wraps with ClerkProvider which may not hydrate
   correctly when Clerk env vars are missing in dev. Plain anchors always work. */
"use client";

import {
  Brain,
  Database,
  Mic,
  Plug,
  Check,
  X,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { PLANS, formatLimit, isUnlimited } from "@/lib/billing/plans";
import type { Plan } from "@/lib/billing/plans";
import type { TranslationKeys } from "@/lib/demo/i18n/types";
import { MobileNav } from "./_components/mobile-nav";
import { useI18n } from "@/lib/demo/i18n/context";
import { LanguageToggle } from "./_components/language-toggle";

const COURSES_URL =
  process.env.NEXT_PUBLIC_COURSES_URL || "https://courses.alltherest.world";

const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL || "https://www.alltherest.world";

const FEATURES: { icon: typeof Brain; titleKey: keyof TranslationKeys; descKey: keyof TranslationKeys }[] = [
  { icon: Brain, titleKey: "features.multiModel", descKey: "features.multiModelDesc" },
  { icon: Database, titleKey: "features.knowledgeBase", descKey: "features.knowledgeBaseDesc" },
  { icon: Mic, titleKey: "features.voiceFirst", descKey: "features.voiceFirstDesc" },
  { icon: Plug, titleKey: "features.integrations", descKey: "features.integrationsDesc" },
];

const STEPS: { step: string; titleKey: keyof TranslationKeys; descKey: keyof TranslationKeys }[] = [
  { step: "1", titleKey: "howItWorks.step1Title", descKey: "howItWorks.step1Desc" },
  { step: "2", titleKey: "howItWorks.step2Title", descKey: "howItWorks.step2Desc" },
  { step: "3", titleKey: "howItWorks.step3Title", descKey: "howItWorks.step3Desc" },
];

const INTEGRATIONS = [
  "Claude",
  "GPT",
  "Gemini",
  "Stripe",
  "GitHub",
  "Vercel",
  "HubSpot",
  "Notion",
];

function PlanCard({ plan, popular, t }: { plan: Plan; popular?: boolean; t: (key: keyof TranslationKeys, vars?: Record<string, string | number>) => string }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        popular
          ? "border-emerald-600 bg-emerald-50/50 shadow-lg ring-1 ring-emerald-600 dark:bg-emerald-950/20"
          : "border-border"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white">
          {t("pricing.mostPopular")}
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <div className="mt-2">
          {plan.priceMonthly === 0 ? (
            <span className="text-4xl font-bold">{t("pricing.free")}</span>
          ) : (
            <>
              <span className="text-4xl font-bold">${plan.priceMonthly}</span>
              <span className="text-muted-foreground">{t("pricing.perMonth")}</span>
            </>
          )}
        </div>
      </div>

      <ul className="mb-8 flex-1 space-y-3 text-sm">
        <li className="flex items-center gap-2.5">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
          {formatLimit(plan.limits.projects, "projects")}{" "}
          {isUnlimited(plan.limits.projects)
            ? ""
            : plan.limits.projects === 1
              ? t("pricing.project")
              : t("pricing.projects")}
        </li>
        <li className="flex items-center gap-2.5">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
          {formatLimit(plan.limits.tokensPerMonth, "tokens")} {t("pricing.tokensMonth")}
        </li>
        <li className="flex items-center gap-2.5">
          <Check className="h-4 w-4 shrink-0 text-emerald-600" />
          {formatLimit(plan.limits.kbStorageMb, "MB")} {t("pricing.knowledgeBase")}
        </li>
        <li className="flex items-center gap-2.5">
          {plan.limits.agentActions ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <X className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span
            className={plan.limits.agentActions ? "" : "text-muted-foreground"}
          >
            {t("pricing.agentActions")}
          </span>
        </li>
        {plan.id === "scale" && (
          <li className="flex items-center gap-2.5">
            <Check className="h-4 w-4 shrink-0 text-emerald-600" />
            {t("pricing.prioritySupport")}
          </li>
        )}
      </ul>

      <a
        href="/sign-up"
        className={`inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-medium transition-colors ${
          popular
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "border border-border bg-background hover:bg-accent"
        }`}
      >
        {plan.priceMonthly === 0 ? t("pricing.getStartedFree") : t("pricing.startPlan", { name: plan.name })}
      </a>
    </div>
  );
}

export default function Home() {
  const { t } = useI18n();
  const plans = Object.values(PLANS);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <a
              href={LANDING_URL}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              ATR
            </a>
            <span className="text-border">|</span>
            <a href="/" className="text-xl font-bold">
              Resto
            </a>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.features")}
            </a>
            <a
              href="/use-cases"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.useCases")}
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.pricing")}
            </a>
            <a
              href={COURSES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("nav.courses")}
            </a>
            <LanguageToggle />
            <a
              href="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              {t("nav.getStarted")}
            </a>
          </nav>

          <MobileNav coursesUrl={COURSES_URL} landingUrl={LANDING_URL} />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 dark:border-emerald-800 dark:bg-emerald-950/50">
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {t("hero.badge")}
            </span>
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            {t("hero.title1")}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {t("hero.title2")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-8 text-base font-medium text-white shadow-md transition-colors hover:bg-emerald-700"
            >
              {t("hero.cta")}
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#pricing"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-blue-600 px-8 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              {t("hero.seePricing")}
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border bg-muted/30 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t("features.title1")}
                <span className="text-emerald-600">{t("features.title2")}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t("features.subtitle")}
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.titleKey}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                    <feature.icon className="size-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{t(feature.titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(feature.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-border px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t("howItWorks.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t("howItWorks.subtitle")}
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-blue-600 text-lg font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold">{t(step.titleKey)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(step.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="border-t border-border bg-muted/30 px-6 py-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-medium text-muted-foreground">
              {t("integrationsSection.title")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {INTEGRATIONS.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="border-t border-border px-6 py-24"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t("pricing.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                {t("pricing.subtitle")}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  popular={plan.id === "pro"}
                  t={t}
                />
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {t("pricing.footer")}
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border bg-gradient-to-br from-emerald-600 to-blue-600 px-6 py-24 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              {t("cta.subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-base font-medium text-emerald-700 shadow-md transition-colors hover:bg-gray-100"
              >
                {t("cta.getStarted")}
                <ArrowRight className="size-4" />
              </a>
              <a
                href={COURSES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-8 text-base font-medium text-white transition-colors hover:bg-white/10"
              >
                {t("cta.exploreCourses")}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright", { year: String(new Date().getFullYear()) })}
          </p>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href={LANDING_URL}
              className="transition-colors hover:text-foreground"
            >
              {t("footer.atrHome")}
            </a>
            <a
              href="/pricing"
              className="transition-colors hover:text-foreground"
            >
              {t("nav.pricing")}
            </a>
            <a
              href={COURSES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              {t("nav.courses")}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
