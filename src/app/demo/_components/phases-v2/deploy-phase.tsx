"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ExternalLink, Rocket, Github, Globe, PartyPopper, Server, Shield, Zap, Database, Lock } from "lucide-react";
import type { DeployContent, ViewMode } from "@/lib/demo/types";

function LaunchCountdown({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const timer = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(timer);
  }, [count, onDone]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 animate-ping rounded-full bg-emerald-500/10" style={{ animationDuration: "0.8s" }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 animate-ping rounded-full bg-emerald-500/20" style={{ animationDuration: "0.8s", animationDelay: "0.2s" }} />
        </div>
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-cyan-500 shadow-2xl shadow-emerald-500/30">
          {count > 0 ? (
            <span key={count} className="text-5xl font-black text-white animate-in zoom-in-50 duration-300">{count}</span>
          ) : (
            <Rocket className="h-12 w-12 text-white animate-in zoom-in-50 duration-300" />
          )}
        </div>
      </div>
      <p className="font-mono text-lg tracking-widest text-muted-foreground">{count > 0 ? "LAUNCHING IN..." : "LIFTOFF!"}</p>
    </div>
  );
}

function Confetti() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 3}s`,
    color: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"][i % 5],
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: p.left, top: "-10px", width: p.size, height: p.size,
            backgroundColor: p.color, borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: p.delay, animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

const INFRA_STEPS = [
  { icon: Database, label: "Database provisioned", detail: "PostgreSQL + pgvector on Neon" },
  { icon: Server, label: "Edge functions deployed", detail: "Vercel Edge Runtime, 30+ regions" },
  { icon: Lock, label: "SSL/TLS configured", detail: "Auto-provisioned via Let's Encrypt" },
  { icon: Shield, label: "Security scan passed", detail: "0 vulnerabilities, CSP headers set" },
  { icon: Globe, label: "DNS propagation", detail: "Cloudflare CDN, <50ms global TTFB" },
  { icon: Zap, label: "Performance optimized", detail: "Lighthouse 98/100, Core Web Vitals green" },
];

type Props = {
  isPlaying: boolean;
  onComplete: () => void;
  content: DeployContent;
  viewMode?: ViewMode;
};

export default function DeployPhase({ isPlaying, onComplete, content, viewMode = "magic" }: Props) {
  const [stage, setStage] = useState<"countdown" | "deploying" | "celebration">("countdown");
  const [visibleLines, setVisibleLines] = useState(0);
  const [visibleInfra, setVisibleInfra] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCountdownDone = useCallback(() => setStage("deploying"), []);

  useEffect(() => {
    if (stage !== "deploying") return;
    if (viewMode === "tech" || viewMode === "split") {
      if (visibleLines >= content.terminalLines.length) return;
      const nextDelay = visibleLines === 0 ? 500 : (content.terminalLines[visibleLines]?.delay ?? 0) - (content.terminalLines[visibleLines - 1]?.delay ?? 0);
      const timer = setTimeout(() => setVisibleLines((v) => v + 1), nextDelay);
      return () => clearTimeout(timer);
    }
    if (viewMode === "magic") {
      if (visibleInfra >= INFRA_STEPS.length) return;
      const timer = setTimeout(() => setVisibleInfra((v) => v + 1), 700);
      return () => clearTimeout(timer);
    }
  }, [stage, visibleLines, visibleInfra, content.terminalLines, viewMode]);

  useEffect(() => {
    if (stage !== "deploying") return;
    const techDone = visibleLines >= content.terminalLines.length;
    const magicDone = visibleInfra >= INFRA_STEPS.length;
    const done = viewMode === "tech" ? techDone : viewMode === "split" ? techDone && magicDone : magicDone;
    if (done) {
      const timer = setTimeout(() => { setStage("celebration"); setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000); }, 800);
      return () => clearTimeout(timer);
    }
  }, [stage, visibleLines, visibleInfra, content.terminalLines.length, viewMode]);

  useEffect(() => {
    if (stage === "celebration" && isPlaying) {
      const timer = setTimeout(onComplete, 5000);
      return () => clearTimeout(timer);
    }
  }, [stage, isPlaying, onComplete]);

  if (stage === "countdown") return <LaunchCountdown onDone={handleCountdownDone} />;

  const terminalView = (
    <div className="w-full max-w-2xl">
      <div className="rounded-t-lg bg-zinc-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-zinc-400">Terminal &mdash; Deploying to Production</span>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto rounded-b-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed">
        {content.terminalLines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={cn("whitespace-pre-wrap", line.type === "command" && "mt-2 text-zinc-100", line.type === "output" && "text-zinc-500", line.type === "success" && "text-emerald-400", line.type === "info" && "text-blue-400")}>
            {line.text}
          </div>
        ))}
        {visibleLines < content.terminalLines.length && <span className="inline-block h-4 w-2 animate-pulse bg-zinc-400" />}
      </div>
    </div>
  );

  const magicView = (
    <div className="w-full max-w-md space-y-3">
      <h3 className="text-center text-lg font-semibold">Deploying your product</h3>
      <p className="text-center text-sm text-muted-foreground">Everything is being set up automatically</p>
      <div className="space-y-2 pt-2">
        {INFRA_STEPS.map((step, i) => {
          const done = i < visibleInfra;
          const active = i === visibleInfra - 1;
          return (
            <div
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-all duration-500",
                done ? "border-emerald-800/50 bg-emerald-950/50" : "border-zinc-800 bg-zinc-900/50 opacity-40",
                active && "ring-1 ring-emerald-500/30 scale-[1.02]"
              )}
            >
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all", done ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-500")}>
                {done ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
              </div>
              <div>
                <p className={cn("text-sm font-medium", done ? "text-emerald-300" : "text-zinc-500")}>{step.label}</p>
                <p className="text-xs text-zinc-500">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto p-6">
      {showConfetti && <Confetti />}

      {stage === "deploying" && (
        viewMode === "split" ? (
          <div className="flex w-full max-w-5xl gap-6">
            <div className="flex-1">{magicView}</div>
            <div className="w-px bg-zinc-800" />
            <div className="flex flex-1 items-start justify-center">{terminalView}</div>
          </div>
        ) : viewMode === "tech" ? (
          <>
            {terminalView}
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
          magicView
        )
      )}

      {stage === "celebration" && (
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 animate-in zoom-in-50 duration-700">
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
          <p className="animate-pulse text-sm text-muted-foreground">Transitioning to Day 2 operations...</p>
        </div>
      )}
    </div>
  );
}
