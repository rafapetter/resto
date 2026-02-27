"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  TrendingUp,
  Users,
  Activity,
  Shield,
  Check,
  Clock,
  DollarSign,
  ArrowRight,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/demo/i18n/context";
import type { OperationsContent } from "@/lib/demo/types";

const COMPARISON_ROWS = [
  { labelKey: "operations.timeToLaunch", traditionalKey: "operations.trad6to12months", restoKey: "operations.resto12minutes", icon: Clock },
  { labelKey: "operations.devCost", traditionalKey: "operations.trad80kTo250k", restoKey: "operations.restoZeroUpfront", icon: DollarSign },
  { labelKey: "operations.teamRequired", traditionalKey: "operations.trad5to15people", restoKey: "operations.restoJustYou", icon: Users },
  { labelKey: "operations.availability", traditionalKey: "operations.tradBusinessHours", restoKey: "operations.resto247", icon: Activity },
  { labelKey: "operations.updatesMaintenance", traditionalKey: "operations.tradManualExpensive", restoKey: "operations.restoContinuous", icon: Shield },
  { labelKey: "operations.gtmStrategy", traditionalKey: "operations.tradHireConsultants", restoKey: "operations.restoAiDriven", icon: TrendingUp },
] as const;

type Props = {
  isPlaying: boolean;
  onComplete: () => void;
  content: OperationsContent;
};

export default function OperationsPhase({ isPlaying, onComplete, content }: Props) {
  const { t } = useI18n();
  const [stage, setStage] = useState<"comparison" | "cta">("comparison");
  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {
    if (stage !== "comparison") return;
    if (visibleRows < COMPARISON_ROWS.length) {
      const timer = setTimeout(() => setVisibleRows((v) => v + 1), 400);
      return () => clearTimeout(timer);
    }
  }, [stage, visibleRows]);

  const allRowsVisible = visibleRows >= COMPARISON_ROWS.length;

  return (
    <div className="h-full overflow-y-auto bg-zinc-950 text-white">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 p-6 pb-24 pt-10 animate-in fade-in duration-700">
        {/* Comparison heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            The{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">{t("operations.oldWay")}</span>
            {" "}vs{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{t("operations.resto")}</span>
          </h2>
          <p className="mt-2 text-zinc-400">{t("operations.everythingIn12Min")}</p>
        </div>

        {/* Comparison table */}
        <div className="w-full">
          <div className="mb-2 grid grid-cols-[1fr_140px_140px] gap-3 px-3 text-xs font-medium text-zinc-500">
            <span />
            <span className="text-center">{t("operations.traditional")}</span>
            <span className="text-center text-emerald-400">{t("operations.resto")}</span>
          </div>
          <div className="space-y-2">
            {COMPARISON_ROWS.map((row, i) => {
              const visible = i < visibleRows;
              return (
                <div
                  key={row.labelKey}
                  className={cn(
                    "grid grid-cols-[1fr_140px_140px] items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-3 transition-all duration-500",
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <row.icon className="h-4 w-4 text-zinc-400" />
                    <span className="text-sm font-medium">{t(row.labelKey)}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-center text-sm text-red-400">
                    <X className="h-3 w-3 shrink-0 opacity-50" />
                    {t(row.traditionalKey)}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-center text-sm font-medium text-emerald-400">
                    <Check className="h-3 w-3 shrink-0" />
                    {t(row.restoKey)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA section — appears after all rows are visible */}
        {allRowsVisible && (
          <div className="flex w-full flex-col items-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center">
              <h3 className="text-2xl font-bold sm:text-3xl">
                {t("operations.readyToBuild")}
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-400">
                {t("operations.whatTakesTraditional")}
              </p>
            </div>

            {content.finalMetrics && (
              <div className="flex gap-8 text-center">
                {content.finalMetrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-2xl font-bold text-emerald-400">{m.value}</p>
                    <p className="text-xs text-zinc-500">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <a href="/sign-up">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-base font-semibold hover:from-emerald-700 hover:to-cyan-700">
                  {t("operations.startBuilding")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="/use-cases">
                <Button size="lg" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  {t("operations.exploreMoreUseCases")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>

            <p className="text-center text-xs text-zinc-600">
              {t("operations.noCreditCard")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
