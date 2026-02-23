"use client";

import { useState, useCallback, useEffect, Suspense, lazy } from "react";
import type { DemoPhaseKey, UseCaseDemoContent } from "@/lib/demo/types";
import { DEMO_PHASES } from "@/lib/demo/phases";
import { loadDemoContent } from "@/lib/demo/content";
import { DemoHeaderV2 } from "./demo-header-v2";
import { DemoSidebarV2 } from "./demo-sidebar-v2";
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
};

type Props = { slug: string };

export function DemoPlayerShell({ slug }: Props) {
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

  if (!content) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading demo...</p>
        </div>
      </div>
    );
  }

  const phaseDef = DEMO_PHASES.find((p) => p.key === phase)!;
  const PhaseComponent = PhaseComponents[phase];

  // Get the right content slice for the current phase
  const phaseContent = content[phase as keyof UseCaseDemoContent];

  return (
    <div className="flex h-screen flex-col">
      <DemoHeaderV2
        currentPhase={phase}
        phases={DEMO_PHASES}
        isPlaying={isPlaying}
        useCaseName={content.onboarding.projectName}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onPhaseClick={(p) => { setPhase(p); setIsPlaying(false); }}
        onSkip={skipToEnd}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className={cn("transition-all duration-300", phaseDef.showSidebar ? "w-52" : "w-0")}>
          {phaseDef.showSidebar && (
            <DemoSidebarV2
              activeItem={phaseDef.sidebarItem}
              showProjectNav={phaseDef.showProjectNav}
              projectName={content.onboarding.projectName}
            />
          )}
        </div>
        <main className="flex-1 overflow-hidden">
          <Suspense fallback={<PhaseSkeleton />}>
            <PhaseComponent
              isPlaying={isPlaying}
              onComplete={nextPhase}
              content={phaseContent}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
