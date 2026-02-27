"use client";

import { Eye, Code, Columns2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/demo/types";

const VIEW_MODE_OPTIONS: { mode: ViewMode; icon: typeof Eye; label: string }[] = [
  { mode: "magic", icon: Eye, label: "Magic" },
  { mode: "tech", icon: Code, label: "Tech" },
  { mode: "split", icon: Columns2, label: "Both" },
];

type Props = {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
};

export function ViewModeBar({ viewMode, onViewModeChange }: Props) {
  return (
    <div className="flex items-center justify-center border-b bg-muted/30 px-4 py-1">
      <div className="flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5">
        {VIEW_MODE_OPTIONS.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
              viewMode === mode
                ? mode === "magic"
                  ? "bg-blue-600 text-white"
                  : mode === "tech"
                    ? "bg-red-600 text-white"
                    : "bg-violet-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
