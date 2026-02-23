"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Check,
  ExternalLink,
  Rocket,
  Github,
  Globe,
  PartyPopper,
} from "lucide-react";

// ─── Terminal lines ─────────────────────────────────────────────────

type TermLine = {
  text: string;
  type: "command" | "output" | "success" | "info";
  delay: number;
};

const TERMINAL: TermLine[] = [
  { text: "$ git init && git add .", type: "command", delay: 0 },
  { text: "Initialized empty Git repository", type: "output", delay: 800 },
  { text: "$ git commit -m \"feat: initial scaffold\"", type: "command", delay: 1200 },
  {
    text: "[main (root-commit) a3f7c21] feat: initial scaffold\n 47 files changed, 3842 insertions(+)",
    type: "output",
    delay: 2000,
  },
  { text: "$ git remote add origin github.com/bellas-bistro/app", type: "command", delay: 3000 },
  { text: "$ git push -u origin main", type: "command", delay: 3800 },
  {
    text: "Enumerating objects: 89, done.\nCounting objects: 100% (89/89), done.\nTo github.com:bellas-bistro/app.git\n * [new branch]    main -> main",
    type: "output",
    delay: 4800,
  },
  { text: "✓ Pushed to GitHub", type: "success", delay: 6000 },
  { text: "$ vercel --prod", type: "command", delay: 7000 },
  {
    text: "Vercel CLI 48.10.4\nInspecting project settings...\nBuilding project...",
    type: "output",
    delay: 8000,
  },
  {
    text: "Route (app)                Size\n┌ ○ /                      5.2 kB\n├ ○ /menu                  3.8 kB\n├ ○ /order                 4.1 kB\n├ ƒ /api/menu              1.2 kB\n├ ƒ /api/checkout          0.9 kB\n└ ƒ /api/webhooks/stripe   0.4 kB",
    type: "info",
    delay: 10000,
  },
  {
    text: "✓ Production deployment complete!",
    type: "success",
    delay: 12000,
  },
  {
    text: "✓ https://bellas-bistro.vercel.app → Ready",
    type: "success",
    delay: 13000,
  },
];

// ─── Component ──────────────────────────────────────────────────────

type Props = {
  isPlaying: boolean;
  onComplete: () => void;
};

export function DeployPhase({ isPlaying, onComplete }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (visibleLines >= TERMINAL.length) return;

    const nextDelay =
      visibleLines === 0
        ? 500
        : (TERMINAL[visibleLines]?.delay ?? 0) -
          (TERMINAL[visibleLines - 1]?.delay ?? 0);

    const timer = setTimeout(
      () => setVisibleLines((v) => v + 1),
      nextDelay
    );
    return () => clearTimeout(timer);
  }, [visibleLines]);

  // Show celebration after all terminal lines
  useEffect(() => {
    if (visibleLines >= TERMINAL.length) {
      const timer = setTimeout(() => setShowCelebration(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto p-6">
      {!showCelebration ? (
        <>
          {/* Terminal */}
          <div className="w-full max-w-2xl">
            <div className="rounded-t-lg bg-zinc-800 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-zinc-400">
                  Terminal — Deploying Bella&apos;s Bistro
                </span>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto rounded-b-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed">
              {TERMINAL.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "whitespace-pre-wrap",
                    line.type === "command" && "mt-2 text-zinc-100",
                    line.type === "output" && "text-zinc-500",
                    line.type === "success" && "text-emerald-400",
                    line.type === "info" && "text-blue-400"
                  )}
                >
                  {line.text}
                </div>
              ))}
              {visibleLines < TERMINAL.length && (
                <span className="inline-block h-4 w-2 animate-pulse bg-zinc-400" />
              )}
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-6 text-sm">
            {[
              { icon: Github, label: "GitHub", done: visibleLines >= 8 },
              { icon: Globe, label: "Build", done: visibleLines >= 11 },
              { icon: Rocket, label: "Deploy", done: visibleLines >= 13 },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                    step.done
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.done ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    step.done ? "font-medium" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Celebration */
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
            <PartyPopper className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Your app is live!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Bella&apos;s Bistro has been deployed to production
            </p>
          </div>

          <Card className="w-full max-w-md border-emerald-200 dark:border-emerald-800">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">
                    bellas-bistro.vercel.app
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Production deployment
                  </p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                <Check className="mr-1 h-3 w-3" />
                Live
              </Badge>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600">47</p>
              <p className="text-xs text-muted-foreground">Files generated</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">6</p>
              <p className="text-xs text-muted-foreground">API routes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">3</p>
              <p className="text-xs text-muted-foreground">Integrations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">&lt;5 min</p>
              <p className="text-xs text-muted-foreground">Total time</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-2">
            <a href="/sign-up">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Start Building with Resto
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="/">
              <Button size="lg" variant="outline">
                Back to Home
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
