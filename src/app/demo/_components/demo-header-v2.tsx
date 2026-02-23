"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DemoPhaseKey, DemoPhaseDefinition } from "@/lib/demo/types";

type Props = {
  currentPhase: DemoPhaseKey;
  phases: DemoPhaseDefinition[];
  isPlaying: boolean;
  useCaseName: string;
  onTogglePlay: () => void;
  onPhaseClick: (phase: DemoPhaseKey) => void;
  onSkip: () => void;
};

export function DemoHeaderV2({
  currentPhase,
  phases,
  isPlaying,
  useCaseName,
  onTogglePlay,
  onPhaseClick,
  onSkip,
}: Props) {
  const currentIndex = phases.findIndex((p) => p.key === currentPhase);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <a
          href="/use-cases"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Use Cases
        </a>
        <Badge
          variant="secondary"
          className="hidden bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 sm:inline-flex"
        >
          {useCaseName}
        </Badge>
      </div>

      {/* Phase stepper — horizontally scrollable */}
      <nav className="hidden items-center gap-0.5 overflow-x-auto md:flex">
        {phases.map((phase, i) => (
          <button
            key={phase.key}
            onClick={() => onPhaseClick(phase.key)}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-all",
              i === currentIndex
                ? "bg-emerald-600 text-white"
                : i < currentIndex
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
                i === currentIndex
                  ? "bg-white/20"
                  : i < currentIndex
                    ? "bg-emerald-600 text-white"
                    : "bg-muted"
              )}
            >
              {i < currentIndex ? "\u2713" : i + 1}
            </span>
            {phase.label}
          </button>
        ))}
      </nav>

      {/* Mobile phase indicator */}
      <div className="flex items-center gap-1 md:hidden">
        <span className="text-xs font-medium text-muted-foreground">
          {currentIndex + 1}/{phases.length}
        </span>
        <span className="text-xs font-medium">{phases[currentIndex]?.label}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onTogglePlay} className="gap-1.5">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onSkip} className="gap-1.5">
          <SkipForward className="h-4 w-4" />
        </Button>
        <a href="/sign-up">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            Sign Up
          </Button>
        </a>
      </div>
    </header>
  );
}
