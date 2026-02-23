"use client";

import { useState, useCallback } from "react";
import { DemoHeader, type Phase } from "./demo-header";
import { DemoSidebar } from "./demo-sidebar";
import { OnboardingPhase } from "./phases/onboarding-phase";
import { DashboardPhase } from "./phases/dashboard-phase";
import { ChatPhase } from "./phases/chat-phase";
import { BuildPhase } from "./phases/build-phase";
import { DeployPhase } from "./phases/deploy-phase";
import { cn } from "@/lib/utils";

const PHASE_ORDER: Phase[] = [
  "onboarding",
  "dashboard",
  "chat",
  "build",
  "deploy",
];

// Which sidebar item to highlight per phase
const sidebarActive: Record<Phase, string> = {
  onboarding: "projects",
  dashboard: "projects",
  chat: "chat",
  build: "checklist",
  deploy: "projects",
};

export function DemoPlayer() {
  const [phase, setPhase] = useState<Phase>("onboarding");
  const [isPlaying, setIsPlaying] = useState(true);

  const nextPhase = useCallback(() => {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[idx + 1]);
    }
  }, [phase]);

  const skipToEnd = useCallback(() => {
    setPhase("deploy");
    setIsPlaying(false);
  }, []);

  const showSidebar = phase !== "onboarding";
  const showProjectNav = phase === "chat" || phase === "build";

  return (
    <div className="flex h-screen flex-col">
      <DemoHeader
        currentPhase={phase}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onPhaseClick={(p) => {
          setPhase(p);
          setIsPlaying(false);
        }}
        onSkip={skipToEnd}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "transition-all duration-300",
            showSidebar ? "w-56" : "w-0"
          )}
        >
          {showSidebar && (
            <DemoSidebar
              activeItem={sidebarActive[phase]}
              showProjectNav={showProjectNav}
            />
          )}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {phase === "onboarding" && (
            <OnboardingPhase isPlaying={isPlaying} onComplete={nextPhase} />
          )}
          {phase === "dashboard" && (
            <DashboardPhase isPlaying={isPlaying} onComplete={nextPhase} />
          )}
          {phase === "chat" && (
            <ChatPhase isPlaying={isPlaying} onComplete={nextPhase} />
          )}
          {phase === "build" && (
            <BuildPhase isPlaying={isPlaying} onComplete={nextPhase} />
          )}
          {phase === "deploy" && (
            <DeployPhase isPlaying={isPlaying} onComplete={() => setIsPlaying(false)} />
          )}
        </main>
      </div>
    </div>
  );
}
