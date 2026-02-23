"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const PHASES = [
  { key: "onboarding", label: "Setup" },
  { key: "dashboard", label: "Dashboard" },
  { key: "chat", label: "Chat" },
  { key: "build", label: "Build" },
  { key: "deploy", label: "Deploy" },
] as const;

export type Phase = (typeof PHASES)[number]["key"];

type Props = {
  currentPhase: Phase;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPhaseClick: (phase: Phase) => void;
  onSkip: () => void;
};

export function DemoHeader({
  currentPhase,
  isPlaying,
  onTogglePlay,
  onPhaseClick,
  onSkip,
}: Props) {
  const currentIndex = PHASES.findIndex((p) => p.key === currentPhase);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Resto
        </a>
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
        >
          Interactive Demo
        </Badge>
      </div>

      {/* Phase stepper */}
      <nav className="hidden items-center gap-1 md:flex">
        {PHASES.map((phase, i) => (
          <button
            key={phase.key}
            onClick={() => onPhaseClick(phase.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              i === currentIndex
                ? "bg-emerald-600 text-white"
                : i < currentIndex
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
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

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePlay}
          className="gap-1.5"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {isPlaying ? "Pause" : "Auto-play"}
          </span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onSkip} className="gap-1.5">
          <SkipForward className="h-4 w-4" />
          <span className="hidden sm:inline">Skip</span>
        </Button>
        <a href="/sign-up">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            Sign Up Free
          </Button>
        </a>
      </div>
    </header>
  );
}
