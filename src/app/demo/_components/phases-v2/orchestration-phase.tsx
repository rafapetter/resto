"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Radio, Activity, MessageSquare } from "lucide-react";
import type { OrchestrationContent, AgentCharacter } from "@/lib/demo/types";
import { useI18n } from "@/lib/demo/i18n/context";

type AgentStatus = "working" | "idle" | "communicating" | "needs-review";

type Props = { isPlaying: boolean; onComplete: () => void; content: OrchestrationContent };

function getAgentPositions(
  leadAgent: AgentCharacter | undefined,
  teamAgents: AgentCharacter[],
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const positions: Record<string, { x: number; y: number; angle: number }> = {};

  if (leadAgent) {
    positions[leadAgent.name] = { x: cx, y: cy, angle: 0 };
  }

  const radius = Math.min(width, height) * 0.40;
  teamAgents.forEach((agent, i) => {
    const angle = (i / teamAgents.length) * Math.PI * 2 - Math.PI / 2;
    positions[agent.name] = {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      angle,
    };
  });

  return positions;
}

function ConnectionLine({
  x1, y1, x2, y2, active, color,
}: {
  x1: number; y1: number; x2: number; y2: number; active: boolean; color: string;
}) {
  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={active ? color : "#475569"}
        strokeWidth={active ? 3 : 0.8}
        strokeDasharray={active ? "10 6" : "4 10"}
        strokeOpacity={active ? 0.8 : 0.15}
        className="transition-all duration-700"
      >
        {active && (
          <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="1s" repeatCount="indefinite" />
        )}
      </line>
      {active && (
        <circle r="5" fill={color} opacity="0.9">
          <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${x1},${y1} L${x2},${y2}`} />
        </circle>
      )}
    </g>
  );
}

function SpeechBubble({ text, x, y, angle, isLead }: { text: string; x: number; y: number; angle: number; isLead: boolean }) {
  const bubbleW = 280;
  const bubbleH = 70;
  let bx: number;
  let by: number;

  if (isLead) {
    bx = x - bubbleW / 2;
    by = y - 120;
  } else {
    const pushDist = 72;
    bx = x + Math.cos(angle) * pushDist - bubbleW / 2;
    by = y + Math.sin(angle) * pushDist - bubbleH / 2;
  }

  return (
    <foreignObject x={bx} y={by} width={bubbleW} height={bubbleH} className="pointer-events-none">
      <div className="flex h-full items-center rounded-xl border border-slate-500/60 bg-slate-800/95 px-4 py-2.5 text-[18px] leading-snug text-slate-100 shadow-xl backdrop-blur-sm">
        <span className="line-clamp-2">{text}</span>
      </div>
    </foreignObject>
  );
}

function StageAgent({
  agent, x, y, angle, status, isLead, speechBubble,
}: {
  agent: AgentCharacter;
  x: number;
  y: number;
  angle: number;
  status: AgentStatus;
  isLead: boolean;
  speechBubble: string | null;
}) {
  const size = isLead ? 56 : 38;
  const statusColor =
    status === "working" ? "#10b981" :
    status === "communicating" ? "#3b82f6" :
    status === "needs-review" ? "#f59e0b" :
    "#64748b";

  return (
    <g>
      {isLead && (
        <>
          <circle cx={x} cy={y} r={size + 22} fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.15">
            <animate attributeName="r" values={`${size + 18};${size + 28};${size + 18}`} dur="4s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.15;0.05;0.15" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r={size + 12} fill="none" stroke="#10b981" strokeWidth="2" strokeOpacity="0.3">
            <animate attributeName="r" values={`${size + 10};${size + 16};${size + 10}`} dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      <circle
        cx={x} cy={y} r={size + 4}
        fill="none"
        stroke={statusColor}
        strokeWidth={status === "working" || status === "communicating" ? 4 : 2}
        strokeOpacity={status === "idle" ? 0.3 : 0.8}
        className="transition-all duration-500"
      >
        {(status === "working" || status === "communicating") && (
          <animate attributeName="stroke-opacity" values="0.8;0.4;0.8" dur="1.5s" repeatCount="indefinite" />
        )}
      </circle>

      <circle cx={x} cy={y} r={size} fill={agent.color || "#1e293b"} opacity="0.9" />

      <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="central" fontSize={isLead ? 44 : 30}>
        {agent.avatar}
      </text>

      {isLead && (
        <>
          <rect
            x={x - 78}
            y={y - size - 34}
            width={156}
            height={28}
            rx="14"
            fill="#065f46"
            opacity="0.95"
          />
          <text x={x} y={y - size - 16} textAnchor="middle" fontSize={15} fill="#6ee7b7" fontWeight="bold" letterSpacing="2">
            ORCHESTRATOR
          </text>
        </>
      )}

      <rect
        x={x - (isLead ? 80 : 65)}
        y={y + size + 6}
        width={isLead ? 160 : 130}
        height={isLead ? 52 : 46}
        rx="6"
        fill="#0f172a"
        opacity="0.85"
      />

      <text x={x} y={y + size + (isLead ? 28 : 26)} textAnchor="middle" fontSize={isLead ? 24 : 20} fill="#f1f5f9" fontWeight="bold">
        {agent.name}
      </text>
      <text x={x} y={y + size + (isLead ? 46 : 43)} textAnchor="middle" fontSize={isLead ? 16 : 14} fill="#94a3b8">
        {agent.role}
      </text>

      <circle cx={x + size * 0.7} cy={y - size * 0.7} r={isLead ? 10 : 8} fill={statusColor} stroke="#0f172a" strokeWidth="2.5">
        {(status === "working" || status === "needs-review") && (
          <animate attributeName="r" values={`${isLead ? 8 : 6};${isLead ? 12 : 9};${isLead ? 8 : 6}`} dur="1.2s" repeatCount="indefinite" />
        )}
      </circle>

      {speechBubble && (
        <SpeechBubble text={speechBubble} x={x} y={y} angle={angle} isLead={isLead} />
      )}
    </g>
  );
}

export default function OrchestrationPhase({ isPlaying, onComplete, content }: Props) {
  const { t } = useI18n();
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [tick, setTick] = useState(0);
  const [speechBubbles, setSpeechBubbles] = useState<Record<string, string | null>>({});
  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const [missionIndex, setMissionIndex] = useState(0);

  const leadAgent = content.agents.find((a) => !a.reportsTo);
  const teamAgents = content.agents.filter((a) => a.reportsTo);

  const stageW = 960;
  const stageH = 700;
  const positions = useMemo(
    () => getAgentPositions(leadAgent, teamAgents, stageW, stageH),
    [leadAgent, teamAgents]
  );

  const missions = useMemo(() => [
    "Analyzing incoming data streams",
    ...content.humanReviewPoints.map((rp) => rp.task),
    "Processing batch operations",
    "Generating performance reports",
    "Optimizing agent workloads",
  ], [content.humanReviewPoints]);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const statuses: Record<string, AgentStatus> = {};
    const bubbles: Record<string, string | null> = {};
    const connections: string[] = [];

    content.agents.forEach((agent, i) => {
      const isReviewPoint = content.humanReviewPoints.some((rp) => rp.agent === agent.name);

      if (isReviewPoint && tick % 5 === 3) {
        statuses[agent.name] = "needs-review";
      } else {
        const cycle: AgentStatus[] = ["working", "communicating", "working", "idle", "working"];
        statuses[agent.name] = cycle[(tick + i) % cycle.length];
      }

      if ((tick + i) % 5 === 0 && agent.tasks.length > 0) {
        bubbles[agent.name] = agent.tasks[(tick + i) % agent.tasks.length];
      } else {
        bubbles[agent.name] = null;
      }

      if (statuses[agent.name] === "communicating" && leadAgent) {
        connections.push(`${agent.name}-${leadAgent.name}`);
      }
    });

    if (leadAgent) {
      statuses[leadAgent.name] = tick % 3 === 0 ? "communicating" : "working";
      if (tick % 4 === 1 && leadAgent.tasks.length > 0) {
        bubbles[leadAgent.name] = leadAgent.tasks[tick % leadAgent.tasks.length];
      }
    }

    setAgentStatuses(statuses);
    setSpeechBubbles(bubbles);
    setActiveConnections(connections);
    setMissionIndex(tick % missions.length);
  }, [tick, content.agents, content.humanReviewPoints, leadAgent, missions]);

  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    if (tick > 8 && isPlaying && !completed) {
      setCompleted(true);
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [tick, isPlaying, onComplete, completed]);

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Live Agent Stage */}
      <Card className="overflow-hidden border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
              <Radio className="relative h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-base font-semibold text-slate-200">{t("orchestration.live")}</span>
            <Badge className="bg-emerald-900 text-xs text-emerald-300">{content.agents.length} {t("orchestration.agents")}</Badge>
          </div>
          <div className="hidden items-center gap-5 text-sm text-slate-400 sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500" /> {t("orchestration.working")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-blue-500" /> {t("orchestration.syncing")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-amber-500" /> {t("orchestration.review")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-slate-500" /> {t("orchestration.idle")}
            </span>
          </div>
        </div>

        <div className="relative flex justify-center px-2 py-2">
          <svg viewBox={`0 0 ${stageW} ${stageH}`} className="h-auto w-full" style={{ maxHeight: "540px" }}>
            <defs>
              <pattern id="stage-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width={stageW} height={stageH} fill="url(#stage-grid)" />

            {leadAgent && teamAgents.map((agent) => {
              const from = positions[agent.name];
              const to = positions[leadAgent.name];
              if (!from || !to) return null;
              const key = `${agent.name}-${leadAgent.name}`;
              return (
                <ConnectionLine
                  key={key}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  active={activeConnections.includes(key)}
                  color="#3b82f6"
                />
              );
            })}

            {teamAgents.map((agent) => {
              const pos = positions[agent.name];
              if (!pos) return null;
              return (
                <StageAgent
                  key={agent.name} agent={agent}
                  x={pos.x} y={pos.y} angle={pos.angle}
                  status={agentStatuses[agent.name] || "idle"}
                  isLead={false}
                  speechBubble={speechBubbles[agent.name] || null}
                />
              );
            })}

            {leadAgent && positions[leadAgent.name] && (
              <StageAgent
                agent={leadAgent}
                x={positions[leadAgent.name].x} y={positions[leadAgent.name].y} angle={0}
                status={agentStatuses[leadAgent.name] || "working"}
                isLead={true}
                speechBubble={speechBubbles[leadAgent.name] || null}
              />
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between border-t border-slate-700 px-5 py-3">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-slate-400" />
            <span className="hidden text-sm text-slate-400 sm:inline">{t("orchestration.currentTask")}</span>
            <span className="text-sm font-medium text-slate-200">{missions[missionIndex]}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MessageSquare className="h-4 w-4" />
            <span>{activeConnections.length} sync{activeConnections.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </Card>

      {/* Human review points */}
      {content.humanReviewPoints.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            {t("orchestration.humanReview")}
          </h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {content.humanReviewPoints.map((rp, i) => (
              <div key={i} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{rp.task}</span>
                  <Badge variant="outline" className="text-[10px]">{rp.agent}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{rp.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
