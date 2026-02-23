"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ExternalLink, Rocket, Github, Globe, PartyPopper } from "lucide-react";
import type { DeployContent } from "@/lib/demo/types";

type Props = { isPlaying: boolean; onComplete: () => void; content: DeployContent };

export default function DeployPhase({ isPlaying, onComplete, content }: Props) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (visibleLines >= content.terminalLines.length) return;
    const nextDelay = visibleLines === 0
      ? 500
      : (content.terminalLines[visibleLines]?.delay ?? 0) - (content.terminalLines[visibleLines - 1]?.delay ?? 0);
    const timer = setTimeout(() => setVisibleLines((v) => v + 1), nextDelay);
    return () => clearTimeout(timer);
  }, [visibleLines, content.terminalLines]);

  useEffect(() => {
    if (visibleLines >= content.terminalLines.length) {
      const timer = setTimeout(() => setShowCelebration(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, content.terminalLines.length]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto p-6">
      {!showCelebration ? (
        <>
          <div className="w-full max-w-2xl">
            <div className="rounded-t-lg bg-zinc-800 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-zinc-400">Terminal &mdash; Deploying to Production</span>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto rounded-b-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed">
              {content.terminalLines.slice(0, visibleLines).map((line, i) => (
                <div key={i} className={cn("whitespace-pre-wrap", line.type === "command" && "mt-2 text-zinc-100", line.type === "output" && "text-zinc-500", line.type === "success" && "text-emerald-400", line.type === "info" && "text-blue-400")}>
                  {line.text}
                </div>
              ))}
              {visibleLines < content.terminalLines.length && <span className="inline-block h-4 w-2 animate-pulse bg-zinc-400" />}
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            {[
              { icon: Github, label: "GitHub", done: visibleLines >= 8 },
              { icon: Globe, label: "Build", done: visibleLines >= 11 },
              { icon: Rocket, label: "Deploy", done: visibleLines >= 13 },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-all", step.done ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground")}>
                  {step.done ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                </div>
                <span className={cn(step.done ? "font-medium" : "text-muted-foreground")}>{step.label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
            <PartyPopper className="h-10 w-10 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Your app is live!</h2>
            <p className="mt-2 text-muted-foreground">Deployed to production successfully</p>
          </div>
          <Card className="w-full max-w-md border-emerald-200 dark:border-emerald-800">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">{content.projectUrl}</p>
                  <p className="text-xs text-muted-foreground">Production deployment</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"><Check className="mr-1 h-3 w-3" />Live</Badge>
            </CardContent>
          </Card>
          <div className="flex gap-8 text-center">
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-emerald-600">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <a href="/sign-up"><Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">Start Building with Resto<ExternalLink className="ml-2 h-4 w-4" /></Button></a>
            <a href="/use-cases"><Button size="lg" variant="outline">More Use Cases</Button></a>
          </div>
        </div>
      )}
    </div>
  );
}
