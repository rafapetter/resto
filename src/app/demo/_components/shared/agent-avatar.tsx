"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

type Status = "working" | "idle" | "communicating" | "needs-review";

type Props = {
  name: string;
  role: string;
  avatar: string;
  color: string;
  status: Status;
  compact?: boolean;
};

const statusStyles: Record<Status, string> = {
  working: "ring-2 ring-emerald-500 animate-pulse",
  idle: "ring-1 ring-muted",
  communicating: "ring-2 ring-blue-500",
  "needs-review": "ring-2 ring-amber-500",
};

const statusLabels: Record<Status, string> = {
  working: "Working",
  idle: "Idle",
  communicating: "Syncing",
  "needs-review": "Needs Review",
};

export function AgentAvatar({ name, role, avatar, status, compact }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg border p-2 transition-all",
        status === "needs-review" && "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950",
        status === "working" && "border-emerald-200 dark:border-emerald-800",
        compact ? "w-20" : "w-28"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full text-lg",
          compact ? "h-8 w-8" : "h-10 w-10",
          statusStyles[status]
        )}
      >
        {avatar}
      </div>
      <span className={cn("text-center font-medium leading-tight", compact ? "text-[10px]" : "text-xs")}>
        {name}
      </span>
      <span className="text-center text-[10px] text-muted-foreground leading-tight">
        {role}
      </span>
      <div className="flex items-center gap-1">
        {status === "needs-review" && (
          <AlertTriangle className="h-3 w-3 text-amber-500" />
        )}
        <span
          className={cn(
            "text-[9px] font-medium",
            status === "working" && "text-emerald-600",
            status === "communicating" && "text-blue-600",
            status === "needs-review" && "text-amber-600",
            status === "idle" && "text-muted-foreground"
          )}
        >
          {statusLabels[status]}
        </span>
      </div>
    </div>
  );
}
