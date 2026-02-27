"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { DemoPhaseKey, AgentCharacter } from "@/lib/demo/types";
import { useI18n } from "@/lib/demo/i18n/context";
import type { TranslationKeys } from "@/lib/demo/i18n/types";

type AgentState = "idle" | "typing" | "reading" | "celebrating" | "sleeping" | "walking";

const PHASE_AGENT_STATES: Record<DemoPhaseKey, AgentState[]> = {
  onboarding:   ["walking", "idle", "idle", "idle"],
  dashboard:    ["reading", "typing", "idle", "reading"],
  chat:         ["typing", "reading", "typing", "idle"],
  voice:        ["reading", "typing", "reading", "typing"],
  integrations: ["typing", "typing", "reading", "typing"],
  build:        ["typing", "typing", "typing", "typing"],
  knowledge:    ["reading", "reading", "typing", "reading"],
  analytics:    ["reading", "typing", "reading", "reading"],
  orchestration:["typing", "reading", "typing", "reading"],
  channels:     ["typing", "typing", "typing", "reading"],
  deploy:       ["celebrating", "celebrating", "celebrating", "celebrating"],
  operations:   ["typing", "sleeping", "typing", "sleeping"],
};

const PIXEL_COLORS = [
  { body: "#10b981", hair: "#065f46" },
  { body: "#3b82f6", hair: "#1e3a8a" },
  { body: "#f59e0b", hair: "#92400e" },
  { body: "#ec4899", hair: "#9d174d" },
  { body: "#8b5cf6", hair: "#5b21b6" },
  { body: "#06b6d4", hair: "#155e75" },
  { body: "#f97316", hair: "#9a3412" },
  { body: "#14b8a6", hair: "#115e59" },
  { body: "#e11d48", hair: "#881337" },
];

const STATE_LABEL_KEYS: Record<AgentState, keyof TranslationKeys | null> = {
  idle: "agents.standby",
  typing: "agents.working",
  reading: "agents.analyzing",
  celebrating: null,
  sleeping: "agents.resting",
  walking: "agents.joining",
};

function PixelCharacter({
  state,
  colorIdx,
  name,
  task,
  tick,
}: {
  state: AgentState;
  colorIdx: number;
  name: string;
  task: string;
  tick: number;
}) {
  const { t } = useI18n();
  const colors = PIXEL_COLORS[colorIdx % PIXEL_COLORS.length];

  const armOffset = state === "typing" ? (tick % 2 === 0 ? -1 : 1) : 0;

  return (
    <div className="flex w-[110px] shrink-0 flex-col items-center gap-1.5">
      {/* Character body — fixed height container, no layout shift */}
      <div className="relative flex h-[42px] w-[28px] items-end justify-center" style={{ imageRendering: "pixelated" }}>
        {/* Sleeping zzz */}
        {state === "sleeping" && (
          <div className="absolute -right-3 -top-1 text-[9px] font-bold text-zinc-500">
            {"z".repeat((tick % 3) + 1)}
          </div>
        )}

        {/* Celebration sparkles */}
        {state === "celebrating" && (
          <>
            <div className="absolute -left-1 top-0 text-[8px]" style={{ opacity: tick % 3 === 0 ? 1 : 0.3 }}>✨</div>
            <div className="absolute -right-1 top-2 text-[8px]" style={{ opacity: tick % 3 === 1 ? 1 : 0.3 }}>🎊</div>
          </>
        )}

        <div className="relative">
          {/* Hair */}
          <div className="mx-auto h-[3px] w-[10px] rounded-t-sm" style={{ backgroundColor: colors.hair }} />
          {/* Head */}
          <div className="mx-auto h-[6px] w-[8px] rounded-sm" style={{ backgroundColor: "#fbbf24" }}>
            {/* Eyes */}
            <div className="absolute left-[1px] top-[5px] flex gap-[3px]">
              <div className="h-[2px] w-[2px] rounded-full bg-zinc-800" />
              <div className="h-[2px] w-[2px] rounded-full bg-zinc-800" />
            </div>
          </div>
          {/* Body */}
          <div className="relative mx-auto h-[10px] w-[10px] rounded-sm" style={{ backgroundColor: colors.body }}>
            {/* Arms */}
            <div
              className="absolute -left-[3px] top-[1px] h-[6px] w-[3px] rounded-sm"
              style={{
                backgroundColor: colors.body,
                transform: `translateY(${armOffset}px)`,
                transition: "transform 0.15s",
              }}
            />
            <div
              className="absolute -right-[3px] top-[1px] h-[6px] w-[3px] rounded-sm"
              style={{
                backgroundColor: colors.body,
                transform: `translateY(${-armOffset}px)`,
                transition: "transform 0.15s",
              }}
            />
          </div>
          {/* Legs */}
          <div className="mx-auto flex gap-[1px]">
            <div className="h-[4px] w-[4px] rounded-b-sm bg-zinc-700" />
            <div className="h-[4px] w-[4px] rounded-b-sm bg-zinc-700" />
          </div>
        </div>
      </div>

      {/* Desk surface */}
      <div className="h-[3px] w-[22px] rounded-sm bg-amber-800/50" />

      {/* Name + status */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="max-w-[100px] truncate text-[10px] font-medium text-zinc-300">{name}</span>
        <span className={cn(
          "max-w-[100px] truncate rounded-full px-1.5 py-px text-[8px] font-medium",
          state === "typing" ? "bg-emerald-900/80 text-emerald-400" :
          state === "reading" ? "bg-blue-900/80 text-blue-400" :
          state === "celebrating" ? "bg-amber-900/80 text-amber-400" :
          state === "sleeping" ? "bg-zinc-800 text-zinc-500" :
          "bg-zinc-800 text-zinc-500"
        )}>
          {state === "typing" || state === "reading" ? task : (STATE_LABEL_KEYS[state] != null ? t(STATE_LABEL_KEYS[state]) : "\u{1F389}")}
        </span>
      </div>
    </div>
  );
}

type Props = {
  agents: AgentCharacter[];
  currentPhase: DemoPhaseKey;
  className?: string;
};

export function PixelAgentBar({ agents, currentPhase, className }: Props) {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 600);
    return () => clearInterval(timer);
  }, []);

  const visibleAgents = useMemo(() => agents.slice(0, 9), [agents]);
  const phaseStates = PHASE_AGENT_STATES[currentPhase] || PHASE_AGENT_STATES.onboarding;

  return (
    <div className={cn("shrink-0 border-t border-zinc-800 bg-zinc-950", className)}>
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between px-4 py-1.5 text-[10px] text-zinc-500 hover:text-zinc-300"
      >
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {t("agents.active", { count: visibleAgents.length })}
        </span>
        {collapsed ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {/* Agents row — fixed height, horizontally scrollable, no overflow */}
      {!collapsed && (
        <div className="flex items-start justify-center gap-4 overflow-x-auto px-4 pb-3 scrollbar-none" style={{ imageRendering: "pixelated" }}>
          {visibleAgents.map((agent, i) => (
            <PixelCharacter
              key={agent.name}
              state={phaseStates[i % phaseStates.length]}
              colorIdx={i}
              name={agent.name.split(" ").slice(0, 2).join(" ")}
              task={agent.tasks[tick % agent.tasks.length] || "Working..."}
              tick={tick + i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
