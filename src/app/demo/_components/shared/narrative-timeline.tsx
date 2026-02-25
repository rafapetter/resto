"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock, DollarSign, TrendingUp } from "lucide-react";
import type { DemoPhaseKey } from "@/lib/demo/types";

const PHASE_PROGRESS: Record<string, { restoMinutes: number; traditionalMonths: number; traditionalCost: number }> = {
  onboarding:   { restoMinutes: 1,  traditionalMonths: 0.5, traditionalCost: 8000 },
  dashboard:    { restoMinutes: 2,  traditionalMonths: 1,   traditionalCost: 20000 },
  integrations: { restoMinutes: 3,  traditionalMonths: 1.5, traditionalCost: 35000 },
  chat:         { restoMinutes: 4,  traditionalMonths: 2,   traditionalCost: 50000 },
  voice:        { restoMinutes: 5,  traditionalMonths: 2.5, traditionalCost: 68000 },
  build:        { restoMinutes: 8,  traditionalMonths: 4,   traditionalCost: 120000 },
  knowledge:    { restoMinutes: 9,  traditionalMonths: 4.5, traditionalCost: 135000 },
  analytics:    { restoMinutes: 10, traditionalMonths: 5,   traditionalCost: 150000 },
  channels:     { restoMinutes: 11, traditionalMonths: 5.5, traditionalCost: 165000 },
  deploy:       { restoMinutes: 12, traditionalMonths: 6,   traditionalCost: 180000 },
  operations:   { restoMinutes: 12, traditionalMonths: 6,   traditionalCost: 180000 },
};

type Props = {
  currentPhase: DemoPhaseKey;
  className?: string;
};

export function NarrativeTimeline({ currentPhase, className }: Props) {
  const [animatedCost, setAnimatedCost] = useState(0);
  const progress = PHASE_PROGRESS[currentPhase];
  const restoPercent = (progress.restoMinutes / 12) * 100;
  const tradPercent = (progress.traditionalMonths / 6) * 100;
  const savedCost = progress.traditionalCost;
  const savedMonths = progress.traditionalMonths;

  useEffect(() => {
    const target = progress.traditionalCost;
    const duration = 800;
    const startTime = Date.now();
    const startValue = animatedCost;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedCost(Math.round(startValue + (target - startValue) * eased));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [progress.traditionalCost]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn("border-b border-zinc-800 bg-zinc-950 px-4 py-2", className)}>
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        {/* Traditional track */}
        <div className="flex flex-1 items-center gap-2">
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Traditional
          </span>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-900 to-red-600 transition-all duration-1000 ease-out"
              style={{ width: `${tradPercent}%` }}
            />
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[10px] text-red-400/80">
            <Clock className="h-2.5 w-2.5" />
            {progress.traditionalMonths}mo
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[10px] text-red-400/80">
            <DollarSign className="h-2.5 w-2.5" />
            {animatedCost.toLocaleString()}
          </span>
        </div>

        {/* Savings badge */}
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-800/60 bg-emerald-950/80 px-2.5 py-1">
          <TrendingUp className="h-3 w-3 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400">
            ${savedCost.toLocaleString()} & {savedMonths}mo saved
          </span>
        </div>

        {/* Resto track */}
        <div className="flex flex-1 items-center gap-2">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Resto
          </span>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${restoPercent}%` }}
            />
            {restoPercent > 0 && restoPercent < 100 && (
              <div
                className="absolute top-0 h-full w-1 animate-pulse rounded-full bg-white/60"
                style={{ left: `${restoPercent}%` }}
              />
            )}
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-emerald-400">
            <Clock className="h-2.5 w-2.5" />
            {progress.restoMinutes}min
          </span>
          <span className="shrink-0 text-[10px] font-bold text-emerald-300">
            $0
          </span>
        </div>
      </div>
    </div>
  );
}
