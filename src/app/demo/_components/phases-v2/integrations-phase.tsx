"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Loader2, Globe, CreditCard, Mail, Calendar, Search, Image, Video, Brain, Hash, FileText, Users, BarChart2, Shield, Phone, Activity, Github, Globe2 } from "lucide-react";
import type { IntegrationsContent } from "@/lib/demo/types";
import { useI18n } from "@/lib/demo/i18n/context";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github, globe: Globe, "credit-card": CreditCard, "globe-2": Globe2,
  mail: Mail, calendar: Calendar, search: Search, image: Image, video: Video,
  brain: Brain, hash: Hash, "file-text": FileText, users: Users,
  "bar-chart-2": BarChart2, shield: Shield, phone: Phone, activity: Activity,
};

const CATEGORY_COLORS: Record<string, string> = {
  DevOps: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Payments: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Communication: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  AI: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  Infrastructure: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  Scheduling: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Analytics: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  Productivity: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  CRM: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
  Compliance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Healthcare: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  Legal: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
  Insurance: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  Logistics: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "Real Estate": "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
  Commerce: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
};

type Props = { isPlaying: boolean; onComplete: () => void; content: IntegrationsContent };

export default function IntegrationsPhase({ isPlaying, onComplete, content }: Props) {
  const { t } = useI18n();
  const [connectedCount, setConnectedCount] = useState(0);

  useEffect(() => {
    if (connectedCount >= content.integrations.length) return;
    const timer = setTimeout(() => setConnectedCount((c) => c + 1), 900);
    return () => clearTimeout(timer);
  }, [connectedCount, content.integrations.length]);

  useEffect(() => {
    if (connectedCount >= content.integrations.length && isPlaying) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [connectedCount, content.integrations.length, isPlaying, onComplete]);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{t("integrations.connecting")}</h2>
        <p className="text-sm text-muted-foreground">{t("integrations.servicesConnected", { connected: connectedCount, total: content.integrations.length })}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {content.integrations.map((integration, i) => {
          const isConnected = i < connectedCount;
          const isConnecting = i === connectedCount;
          const Icon = ICON_MAP[integration.icon] || Globe;
          return (
            <Card key={integration.name} className={cn("transition-all duration-500", i <= connectedCount ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0", isConnected && "border-emerald-200 dark:border-emerald-800")}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", isConnected ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-muted text-muted-foreground")}>
                  {isConnecting ? <Loader2 className="h-5 w-5 animate-spin" /> : isConnected ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{integration.name}</span>
                    <Badge className={cn("text-[10px] shrink-0", CATEGORY_COLORS[integration.category] || "bg-muted")}>{integration.category}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{integration.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
