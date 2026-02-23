import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { USE_CASE_LIST } from "@/lib/demo/use-cases";

export const metadata: Metadata = {
  title: "Use Cases — Resto",
  description:
    "See how Resto builds full-stack businesses across 10 industries with AI agents.",
};

const LANDING_URL =
  process.env.NEXT_PUBLIC_LANDING_URL || "https://www.alltherest.world";

export default function UseCasesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <a
              href={LANDING_URL}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              ATR
            </a>
            <span className="text-muted-foreground">/</span>
            <a href="/" className="text-sm font-medium">
              Resto
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </a>
            <a href="/sign-up">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b px-6 py-20 text-center">
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
        >
          10 Industries
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          AI for{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Every Industry
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          See how Resto builds full-stack businesses from idea to production.
          Dozens of AI agents working together to create your landing pages,
          dashboards, integrations, and more.
        </p>
      </section>

      {/* Use case grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASE_LIST.map((useCase) => (
            <a
              key={useCase.slug}
              href={`/demo/${useCase.slug}`}
              className="group rounded-2xl border bg-card p-6 transition-all hover:border-emerald-300 hover:shadow-lg dark:hover:border-emerald-700"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                  {useCase.icon}
                </span>
                <div>
                  <h3 className="font-semibold">{useCase.name}</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {useCase.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-600 transition-transform group-hover:translate-x-1">
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gradient-to-br from-emerald-600 to-blue-600 px-6 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to build your business?</h2>
        <p className="mx-auto mt-2 max-w-xl text-emerald-100">
          Start with any industry template and let Resto&apos;s AI agents do the heavy lifting.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="/sign-up">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-white/90">
              Get Started Free
            </Button>
          </a>
          <a href="/">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Back to Home
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ATR. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-foreground">Home</a>
            <a href="/sign-up" className="hover:text-foreground">Sign Up</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
