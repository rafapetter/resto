"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Check, Brain, Code, Rocket, Plug, MessageSquare, DollarSign } from "lucide-react";
import type { OnboardingContent } from "@/lib/demo/types";
import { useI18n } from "@/lib/demo/i18n/context";

const AUTONOMY_CATEGORIES = [
  { key: "knowledge", labelKey: "onboarding.autoKnowledge" as const, icon: Brain },
  { key: "code", labelKey: "onboarding.autoCodeGen" as const, icon: Code },
  { key: "deploy", labelKey: "onboarding.autoDeployment" as const, icon: Rocket },
  { key: "integrations", labelKey: "onboarding.autoIntegrations" as const, icon: Plug },
  { key: "comms", labelKey: "onboarding.autoComms" as const, icon: MessageSquare },
  { key: "financial", labelKey: "onboarding.autoFinancial" as const, icon: DollarSign },
];

const LEVELS = [
  { value: "full_auto", labelKey: "onboarding.levelAuto" as const, color: "bg-emerald-600 text-white" },
  { value: "notify", labelKey: "onboarding.levelNotify" as const, color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  { value: "quick", labelKey: "onboarding.levelQuick" as const, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "detail", labelKey: "onboarding.levelDetail" as const, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "manual", labelKey: "onboarding.levelManual" as const, color: "bg-muted text-muted-foreground" },
];

// Default autonomy values for auto-play (maps to AUTONOMY_CATEGORIES keys)
const DEFAULT_AUTONOMY: Record<string, string> = {
  knowledge: "full_auto",
  code: "notify",
  deploy: "detail",
  integrations: "full_auto",
  comms: "quick",
  financial: "manual",
};

type SubStep = "industry" | "vertical" | "features" | "autonomy";

type Props = { isPlaying: boolean; onComplete: () => void; content: OnboardingContent };

export default function OnboardingPhase({ isPlaying, onComplete, content }: Props) {
  const { t } = useI18n();
  const [subStep, setSubStep] = useState<SubStep>("industry");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [autonomy, setAutonomy] = useState<Record<string, string>>({});
  const [autonomyAnimIndex, setAutonomyAnimIndex] = useState(-1);
  const [launching, setLaunching] = useState(false);
  const autonomyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Staggered autonomy animation during auto-play
  useEffect(() => {
    if (subStep !== "autonomy" || !isPlaying) return;
    if (autonomyAnimIndex >= AUTONOMY_CATEGORIES.length) {
      // All rows animated — launch after a brief pause
      const t = setTimeout(() => {
        setLaunching(true);
        setTimeout(onComplete, 1500);
      }, 600);
      return () => clearTimeout(t);
    }
    if (autonomyAnimIndex < 0) {
      // Start the cascade
      const t = setTimeout(() => setAutonomyAnimIndex(0), 400);
      return () => clearTimeout(t);
    }
    const cat = AUTONOMY_CATEGORIES[autonomyAnimIndex];
    autonomyTimerRef.current = setTimeout(() => {
      setAutonomy((prev) => ({
        ...prev,
        [cat.key]: DEFAULT_AUTONOMY[cat.key] || "full_auto",
      }));
      setAutonomyAnimIndex((i) => i + 1);
    }, 350);
    return () => {
      if (autonomyTimerRef.current) clearTimeout(autonomyTimerRef.current);
    };
  }, [subStep, isPlaying, autonomyAnimIndex, onComplete]);

  const advance = useCallback(() => {
    if (subStep === "industry") {
      setSelectedIndustry(content.autoSelections.industry);
      setTimeout(() => setSubStep("vertical"), 600);
    } else if (subStep === "vertical") {
      setSelectedVertical(content.autoSelections.vertical);
      setTimeout(() => setSubStep("features"), 600);
    } else if (subStep === "features") {
      setSelectedFeatures(content.autoSelections.features);
      setTimeout(() => setSubStep("autonomy"), 600);
    }
    // autonomy is handled by the staggered animation effect above
  }, [subStep, content]);

  useEffect(() => {
    if (!isPlaying || subStep === "autonomy") return;
    const timer = setTimeout(advance, 1800);
    return () => clearTimeout(timer);
  }, [isPlaying, advance, subStep]);

  const stepIndex = subStep === "industry" ? 0 : subStep === "vertical" ? 1 : subStep === "features" ? 2 : 3;
  const breadcrumbs = [t("onboarding.stepIndustry"), t("onboarding.stepVertical"), t("onboarding.stepFeatures"), t("onboarding.stepAutonomy")];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-center gap-2 text-sm">
        {breadcrumbs.map((label, i) => (
          <span key={label} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            <span className={cn("rounded-full px-3 py-1 transition-all", i === stepIndex ? "bg-emerald-600 font-medium text-white" : i < stepIndex ? "text-emerald-600" : "text-muted-foreground")}>
              {i < stepIndex ? <Check className="inline h-3 w-3" /> : null} {label}
            </span>
          </span>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {subStep === "industry" && t("onboarding.questionIndustry")}
          {subStep === "vertical" && t("onboarding.questionVertical")}
          {subStep === "features" && t("onboarding.questionFeatures")}
          {subStep === "autonomy" && t("onboarding.questionAutonomy")}
        </h2>
      </div>

      {subStep === "industry" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {content.industries.map((ind) => (
            <Card key={ind.id} className={cn("cursor-pointer transition-all hover:shadow-md", selectedIndustry === ind.id && "ring-2 ring-emerald-600")} onClick={() => { setSelectedIndustry(ind.id); if (!isPlaying) setTimeout(() => setSubStep("vertical"), 400); }}>
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <span className="text-2xl">{ind.emoji}</span>
                <span className="text-sm font-medium">{ind.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {subStep === "vertical" && (
        <div className="grid grid-cols-2 gap-3">
          {content.verticals.map((v) => (
            <Card key={v.id} className={cn("cursor-pointer transition-all hover:shadow-md", selectedVertical === v.id && "ring-2 ring-emerald-600")} onClick={() => { setSelectedVertical(v.id); if (!isPlaying) setTimeout(() => setSubStep("features"), 400); }}>
              <CardContent className="p-4 text-center"><span className="text-sm font-medium">{v.name}</span></CardContent>
            </Card>
          ))}
        </div>
      )}

      {subStep === "features" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {content.features.map((f) => {
              const checked = selectedFeatures.includes(f.id);
              return (
                <Card key={f.id} className={cn("cursor-pointer transition-all hover:shadow-md", checked && "ring-2 ring-emerald-600")} onClick={() => setSelectedFeatures((prev) => checked ? prev.filter((id) => id !== f.id) : [...prev, f.id])}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={cn("flex h-5 w-5 items-center justify-center rounded border", checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-muted-foreground/30")}>{checked && <Check className="h-3 w-3" />}</div>
                    <span className="text-sm font-medium">{f.name}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {!isPlaying && selectedFeatures.length > 0 && (
            <div className="flex justify-end"><Button onClick={() => setSubStep("autonomy")} className="bg-emerald-600 hover:bg-emerald-700">{t("onboarding.continue")}</Button></div>
          )}
        </div>
      )}

      {subStep === "autonomy" && (
        <div className="space-y-3">
          {AUTONOMY_CATEGORIES.map((cat, catIdx) => {
            const isAnimated = autonomy[cat.key] !== undefined;
            const justAnimated = catIdx === autonomyAnimIndex - 1;
            return (
              <div
                key={cat.key}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 transition-all duration-500",
                  justAnimated && "ring-2 ring-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30",
                  !isAnimated && isPlaying && "opacity-50"
                )}
              >
                <cat.icon className={cn("h-5 w-5 shrink-0 transition-colors duration-300", isAnimated ? "text-emerald-600" : "text-muted-foreground")} />
                <span className="w-24 shrink-0 text-sm font-medium">{t(cat.labelKey)}</span>
                <div className="flex flex-1 gap-1">
                  {LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setAutonomy((prev) => ({ ...prev, [cat.key]: level.value }))}
                      className={cn(
                        "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-all duration-300",
                        autonomy[cat.key] === level.value
                          ? `${level.color} scale-105 shadow-sm`
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {t(level.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {!isPlaying && Object.keys(autonomy).length === 6 && (
            <div className="flex justify-end"><Button onClick={() => { setLaunching(true); setTimeout(onComplete, 1500); }} className="bg-emerald-600 hover:bg-emerald-700">{t("onboarding.launchProject")}</Button></div>
          )}
        </div>
      )}

      {launching && (
        <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in duration-500">
          {/* Neural network thinking animation */}
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 animate-ping rounded-full bg-emerald-500/30" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-cyan-500 shadow-lg shadow-emerald-500/30">
              <Brain className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-cyan-400 bg-clip-text text-transparent">
              {t("onboarding.thinking")}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-500" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
                {t("onboarding.analyzingIndustry")} {content.projectName}
              </p>
              <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-500" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
                {t("onboarding.buildingBlueprint")}
              </p>
              <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-500" style={{ animationDelay: "1.3s", animationFillMode: "both" }}>
                {t("onboarding.settingUp")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
