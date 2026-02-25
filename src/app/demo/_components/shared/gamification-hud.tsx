"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Star, Zap, Trophy, HelpCircle } from "lucide-react";
import type { DemoPhaseKey } from "@/lib/demo/types";

type AchievementDef = {
  id: string;
  title: string;
  icon: string;
  xp: number;
  phase: DemoPhaseKey;
};

const ACHIEVEMENTS: AchievementDef[] = [
  { id: "genesis", title: "Genesis!", icon: "🌱", xp: 100, phase: "onboarding" },
  { id: "command-center", title: "Command Center", icon: "📊", xp: 150, phase: "dashboard" },
  { id: "plugged-in", title: "Plugged In", icon: "🔌", xp: 250, phase: "integrations" },
  { id: "first-conversation", title: "First Conversation", icon: "💬", xp: 200, phase: "chat" },
  { id: "voice-activated", title: "Voice Activated", icon: "🎙️", xp: 200, phase: "voice" },
  { id: "100-files", title: "100 Files Generated!", icon: "📁", xp: 500, phase: "build" },
  { id: "knowledge-base", title: "Knowledge Loaded", icon: "📚", xp: 300, phase: "knowledge" },
  { id: "team-assembled", title: "Team Assembled", icon: "👥", xp: 350, phase: "analytics" },
  { id: "ship-it", title: "Ship It!", icon: "🚀", xp: 1000, phase: "deploy" },
  { id: "never-sleeps", title: "Never Sleeps", icon: "🌙", xp: 500, phase: "operations" },
];

const PHASE_ORDER: DemoPhaseKey[] = [
  "onboarding", "dashboard", "integrations", "chat", "voice",
  "build", "knowledge", "analytics", "deploy", "operations",
];

type AchievementToast = AchievementDef & { id: string; timestamp: number };

type Props = {
  currentPhase: DemoPhaseKey;
  className?: string;
};

export function GamificationHud({ currentPhase, className }: Props) {
  const [xp, setXp] = useState(0);
  const [toasts, setToasts] = useState<AchievementToast[]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const unlockedRef = useRef<Set<string>>(new Set());
  const prevPhaseRef = useRef<DemoPhaseKey>("onboarding");

  const unlockAchievement = useCallback((achievement: AchievementDef) => {
    if (unlockedRef.current.has(achievement.id)) return;
    unlockedRef.current.add(achievement.id);

    setXp((prev) => prev + achievement.xp);
    const toast: AchievementToast = { ...achievement, timestamp: Date.now() };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.timestamp !== toast.timestamp));
    }, 3500);
  }, []);

  // Show XP tooltip on first achievement
  useEffect(() => {
    if (unlockedRef.current.size === 1 && !tooltipDismissed) {
      const timer = setTimeout(() => setShowTooltip(true), 500);
      const dismiss = setTimeout(() => { setShowTooltip(false); setTooltipDismissed(true); }, 6000);
      return () => { clearTimeout(timer); clearTimeout(dismiss); };
    }
  }, [xp, tooltipDismissed]);

  useEffect(() => {
    const achievement = ACHIEVEMENTS.find((a) => a.phase === currentPhase);
    if (achievement) {
      const delay = currentPhase === "onboarding" ? 1500 : 800;
      const timer = setTimeout(() => unlockAchievement(achievement), delay);
      return () => clearTimeout(timer);
    }
  }, [currentPhase, unlockAchievement]);

  useEffect(() => {
    if (currentPhase !== prevPhaseRef.current) {
      const prevIdx = PHASE_ORDER.indexOf(prevPhaseRef.current);
      const currIdx = PHASE_ORDER.indexOf(currentPhase);
      if (currIdx === prevIdx + 1) {
        setComboCount((c) => c + 1);
        setShowCombo(true);
        const timer = setTimeout(() => setShowCombo(false), 2000);
        prevPhaseRef.current = currentPhase;
        return () => clearTimeout(timer);
      } else {
        setComboCount(0);
      }
      prevPhaseRef.current = currentPhase;
    }
  }, [currentPhase]);

  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const xpForNext = 500;

  return (
    <>
      {/* XP Counter - top right, below header + timeline */}
      <div className={cn("fixed right-4 top-[6.5rem] z-50 flex flex-col items-end gap-2", className)}>
        {/* Level + XP */}
        <div className="relative flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/95 px-3 py-1.5 shadow-lg backdrop-blur">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">LVL {level}</span>
          </div>
          <div className="h-4 w-px bg-zinc-700" />
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">{xp} XP</span>
          </div>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
              style={{ width: `${(xpInLevel / xpForNext) * 100}%` }}
            />
          </div>
          <button
            onClick={() => { setShowTooltip((s) => !s); setTooltipDismissed(true); }}
            className="ml-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <HelpCircle className="h-3 w-3" />
          </button>

          {/* Explanation tooltip */}
          {showTooltip && (
            <div className="absolute right-0 top-full mt-2 w-56 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="rounded-lg border border-zinc-700 bg-zinc-900/98 p-3 text-xs text-zinc-300 shadow-xl backdrop-blur">
                <p className="font-semibold text-white mb-1">Demo Progress Tracker</p>
                <p className="text-zinc-400">Earn XP as you explore each step of building your product with Resto. Each milestone unlocks achievements — see how fast AI can build!</p>
                <button
                  onClick={() => { setShowTooltip(false); setTooltipDismissed(true); }}
                  className="mt-2 text-[10px] text-emerald-400 hover:text-emerald-300"
                >
                  Got it
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Combo multiplier */}
        {showCombo && comboCount >= 2 && (
          <div className="animate-in fade-in zoom-in-95 slide-in-from-right-2 duration-300">
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-800/50 bg-amber-950/90 px-3 py-1 text-amber-400 shadow-lg">
              <Trophy className="h-3.5 w-3.5" />
              <span className="text-xs font-bold">{comboCount}x Combo!</span>
            </div>
          </div>
        )}
      </div>

      {/* Achievement Toasts */}
      <div className="fixed bottom-32 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.timestamp}
            className="flex items-center gap-3 rounded-xl border border-emerald-800/50 bg-zinc-950/95 px-4 py-3 shadow-2xl backdrop-blur animate-in slide-in-from-right-5 fade-in duration-500"
          >
            <span className="text-2xl">{toast.icon}</span>
            <div>
              <p className="text-sm font-bold text-white">{toast.title}</p>
              <p className="flex items-center gap-1 text-[11px] text-emerald-400">
                <Zap className="h-3 w-3" />+{toast.xp} XP
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
