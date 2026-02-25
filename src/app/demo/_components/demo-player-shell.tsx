"use client";

import { useState, useCallback, useEffect, Suspense, lazy } from "react";
import type { DemoPhaseKey, ViewMode, UseCaseDemoContent } from "@/lib/demo/types";
import { DEMO_PHASES } from "@/lib/demo/phases";
import { loadDemoContent } from "@/lib/demo/content";
import { DemoHeaderV2 } from "./demo-header-v2";
import { DemoSidebarV2 } from "./demo-sidebar-v2";
import { MatrixEntry } from "./matrix-entry";
import { NarrativeTimeline } from "./shared/narrative-timeline";
import { PixelAgentBar } from "./shared/pixel-agent-bar";
import { GamificationHud } from "./shared/gamification-hud";
import { PhaseSkeleton } from "./shared/phase-skeleton";
import { cn } from "@/lib/utils";

const PhaseComponents: Record<DemoPhaseKey, React.LazyExoticComponent<React.ComponentType<any>>> = {
  onboarding: lazy(() => import("./phases-v2/onboarding-phase")),
  dashboard: lazy(() => import("./phases-v2/dashboard-phase")),
  chat: lazy(() => import("./phases-v2/chat-phase")),
  voice: lazy(() => import("./phases-v2/voice-phase")),
  integrations: lazy(() => import("./phases-v2/integrations-phase")),
  build: lazy(() => import("./phases-v2/build-phase")),
  knowledge: lazy(() => import("./phases-v2/knowledge-phase")),
  analytics: lazy(() => import("./phases-v2/analytics-phase")),
  channels: lazy(() => import("./phases-v2/channels-phase")),
  deploy: lazy(() => import("./phases-v2/deploy-phase")),
  operations: lazy(() => import("./phases-v2/operations-phase")),
};

type Props = { slug: string };

export function DemoPlayerShell({ slug }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [phase, setPhase] = useState<DemoPhaseKey>("onboarding");
  const [isPlaying, setIsPlaying] = useState(true);
  const [content, setContent] = useState<UseCaseDemoContent | null>(null);

  useEffect(() => {
    loadDemoContent(slug).then((c) => {
      if (c) setContent(c);
    });
  }, [slug]);

  const nextPhase = useCallback(() => {
    const keys = DEMO_PHASES.map((p) => p.key);
    const idx = keys.indexOf(phase);
    if (idx < keys.length - 1) setPhase(keys[idx + 1]);
  }, [phase]);

  const skipToEnd = useCallback(() => {
    setPhase("deploy");
    setIsPlaying(false);
  }, []);

  const handleMatrixChoice = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  // Loading state
  if (!content) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="font-mono text-sm text-emerald-500">Loading demo...</p>
        </div>
      </div>
    );
  }

  // Matrix entry screen (before demo starts)
  if (viewMode === null) {
    return (
      <MatrixEntry
        useCaseName={content.onboarding.projectName}
        onChoose={handleMatrixChoice}
      />
    );
  }

  const phaseDef = DEMO_PHASES.find((p) => p.key === phase)!;
  const PhaseComponent = PhaseComponents[phase];
  const phaseContent = content[phase as keyof UseCaseDemoContent];
  const agents = content.analytics?.agents ?? [];

  // Build extra props for phases that support viewMode
  const extraProps: Record<string, unknown> = {};
  if (phase === "build") {
    extraProps.viewMode = viewMode;
    extraProps.techOverlay = content.techOverlay?.build;
  }
  if (phase === "deploy") {
    extraProps.viewMode = viewMode;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <DemoHeaderV2
        currentPhase={phase}
        phases={DEMO_PHASES}
        isPlaying={isPlaying}
        useCaseName={content.onboarding.projectName}
        viewMode={viewMode}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onPhaseClick={(p) => { setPhase(p); setIsPlaying(false); }}
        onSkip={skipToEnd}
        onViewModeChange={setViewMode}
      />

      {/* Narrative Timeline */}
      <NarrativeTimeline currentPhase={phase} />

      {/* Gamification HUD */}
      <GamificationHud currentPhase={phase} />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={cn("transition-all duration-300", phaseDef.showSidebar ? "w-52" : "w-0")}>
          {phaseDef.showSidebar && (
            <DemoSidebarV2
              activeItem={phaseDef.sidebarItem}
              showProjectNav={phaseDef.showProjectNav}
              projectName={content.onboarding.projectName}
            />
          )}
        </div>

        {/* Content area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<PhaseSkeleton />}>
              <PhaseComponent
                isPlaying={isPlaying}
                onComplete={nextPhase}
                content={phaseContent}
                {...extraProps}
              />
            </Suspense>
          </div>

          {/* Pixel Agent Bar */}
          {agents.length > 0 && (
            <PixelAgentBar agents={agents} currentPhase={phase} />
          )}
        </main>
      </div>
    </div>
  );
}
