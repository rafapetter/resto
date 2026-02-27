"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  Target,
  ShoppingCart,
  Clock,
  Repeat,
  ArrowUpRight,
  Zap,
  PieChart,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import type { AnalyticsContent } from "@/lib/demo/types";
import { useI18n } from "@/lib/demo/i18n/context";

type Props = { isPlaying: boolean; onComplete: () => void; content: AnalyticsContent };

const KPI_ICONS = [DollarSign, Users, Target, ShoppingCart, TrendingUp, Repeat, PieChart, Zap];

// Generate deterministic pseudo-random unit economics from chart data
function deriveUnitEconomics(charts: AnalyticsContent["charts"]) {
  const seed = charts.reduce((acc, c) => acc + c.data.reduce((s, d) => s + d.value, 0), 0);
  const r = (min: number, max: number) => Math.round(min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min));

  const cac = r(18, 65);
  const ltv = r(cac * 3, cac * 8);
  const aov = r(28, 180);
  const paybackMonths = +(cac / (aov * 0.3)).toFixed(1);
  const grossMargin = r(55, 78);
  const churnRate = +(r(15, 45) / 10).toFixed(1);
  const nps = r(42, 82);
  const arpu = r(15, 95);
  const conversionRate = +(r(18, 52) / 10).toFixed(1);
  const mrr = r(8, 45) * 1000;

  return { cac, ltv, aov, paybackMonths, grossMargin, churnRate, nps, arpu, conversionRate, mrr };
}

// Generate funnel data from chart values — stage keys are i18n keys, translated at render time
function deriveFunnelData(charts: AnalyticsContent["charts"]) {
  const base = charts[0]?.data.reduce((s, d) => s + d.value, 0) ?? 1000;
  return [
    { stageKey: "analytics.visitors" as const, value: base * 100, pct: 100 },
    { stageKey: "analytics.engaged" as const, value: Math.round(base * 45), pct: 45 },
    { stageKey: "analytics.cart" as const, value: Math.round(base * 18), pct: 18 },
    { stageKey: "analytics.checkout" as const, value: Math.round(base * 8), pct: 8 },
    { stageKey: "analytics.purchased" as const, value: Math.round(base * 3.8), pct: 3.8 },
  ];
}

// Generate cohort retention data — week numbers only, label built at render time
function deriveCohortData() {
  return [
    { week: 1, retention: 100, revenue: 100 },
    { week: 2, retention: 72, revenue: 85 },
    { week: 3, retention: 58, revenue: 74 },
    { week: 4, retention: 48, revenue: 68 },
    { week: 5, retention: 42, revenue: 64 },
    { week: 6, retention: 38, revenue: 61 },
    { week: 8, retention: 34, revenue: 58 },
    { week: 12, retention: 28, revenue: 52 },
  ];
}

// Top performing items
function deriveRankings(charts: AnalyticsContent["charts"]) {
  const data = charts[0]?.data ?? [];
  return data
    .map((d) => ({ name: d.name, value: d.value, change: Math.round((Math.random() - 0.3) * 30) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

const FUNNEL_COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"];

export default function AnalyticsPhase({ isPlaying, onComplete, content }: Props) {
  const { t } = useI18n();
  const [revealStage, setRevealStage] = useState(0);
  // 0=nothing, 1=KPIs, 2=charts, 3=unit economics, 4=funnel+cohort, 5=rankings

  useEffect(() => {
    if (revealStage < 5) {
      const delays = [300, 500, 500, 500, 400];
      const timer = setTimeout(() => setRevealStage((s) => s + 1), delays[revealStage]);
      return () => clearTimeout(timer);
    }
  }, [revealStage]);

  useEffect(() => {
    if (revealStage >= 5 && isPlaying) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [revealStage, isPlaying, onComplete]);

  const unitEcon = useMemo(() => deriveUnitEconomics(content.charts), [content.charts]);

  // Build a unified KPI array: chart-derived + unit economics, always 10 items (2 rows of 5)
  const kpis = useMemo(() => {
    const fromCharts = content.charts.slice(0, 4).map((chart, i) => {
      const values = chart.data.map((d) => d.value);
      const total = values.reduce((a, b) => a + b, 0);
      const avg = Math.round(total / values.length);
      const last = values[values.length - 1] ?? 0;
      const prev = values[values.length - 2] ?? last;
      const change = prev !== 0 ? Math.round(((last - prev) / prev) * 100) : 0;
      return { label: chart.label, value: `${avg.toLocaleString()}`, change, Icon: KPI_ICONS[i % KPI_ICONS.length] };
    });

    const extras: { label: string; value: string; change: number; Icon: typeof DollarSign }[] = [
      { label: t("analytics.cacPayback"), value: `${unitEcon.paybackMonths}mo`, change: 12, Icon: Clock },
      { label: t("analytics.npsScore"), value: `${unitEcon.nps}`, change: -unitEcon.churnRate, Icon: Repeat },
      { label: t("analytics.avgOrderValue"), value: `$${unitEcon.aov}`, change: 8, Icon: ShoppingCart },
      { label: t("analytics.arpu"), value: `$${unitEcon.arpu}`, change: 15, Icon: DollarSign },
      { label: t("analytics.conversionRate"), value: `${unitEcon.conversionRate}%`, change: 0.8, Icon: PieChart },
      { label: t("analytics.monthlyRevenue"), value: `$${(unitEcon.mrr / 1000).toFixed(0)}k`, change: 22, Icon: Zap },
      { label: t("analytics.grossMargin"), value: `${unitEcon.grossMargin}%`, change: 3, Icon: TrendingUp },
      { label: t("analytics.ltvCac"), value: `${(unitEcon.ltv / unitEcon.cac).toFixed(1)}x`, change: 11, Icon: Target },
    ];

    // Fill to exactly 10 items
    const all = [...fromCharts, ...extras];
    return all.slice(0, 10);
  }, [content.charts, unitEcon, t]);

  const funnelData = useMemo(
    () => deriveFunnelData(content.charts).map((d) => ({ stage: t(d.stageKey), value: d.value, pct: d.pct })),
    [content.charts, t],
  );
  const cohortData = useMemo(
    () => deriveCohortData().map((d) => ({ name: `${t("analytics.week")} ${d.week}`, retention: d.retention, revenue: d.revenue })),
    [t],
  );
  const rankings = useMemo(() => deriveRankings(content.charts), [content.charts]);

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
          <BarChart3 className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{t("analytics.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("analytics.subtitle")}</p>
        </div>
        <Badge className="ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
          <Zap className="mr-1 h-3 w-3" /> {t("analytics.live")}
        </Badge>
      </div>

      {/* KPI Cards — always 10 items, 2 rows of 5 */}
      <div className={cn(
        "mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-5 transition-all duration-500",
        revealStage >= 1 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        {kpis.map((kpi, i) => (
          <Card key={i} className="transition-all duration-300" style={{ animationDelay: `${i * 80}ms` }}>
            <CardContent className="p-2.5 sm:p-3">
              <div className="flex items-center justify-between">
                <kpi.Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <div className={cn(
                  "flex items-center gap-0.5 text-[10px] font-medium",
                  kpi.change >= 0 ? "text-emerald-600" : "text-red-500"
                )}>
                  {kpi.change >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {kpi.change >= 0 ? "+" : ""}{kpi.change}%
                </div>
              </div>
              <p className="mt-1.5 text-xl font-bold">{kpi.value}</p>
              <p className="truncate text-[10px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className={cn(
        "mb-4 grid gap-3 lg:grid-cols-2 transition-all duration-500",
        revealStage >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        {content.charts.map((chart, i) => (
          <Card key={i}>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm">{chart.label}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <ResponsiveContainer width="100%" height={160}>
                {chart.type === "bar" ? (
                  <BarChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Unit Economics Section */}
      <div className={cn(
        "mb-4 transition-all duration-500",
        revealStage >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          {t("analytics.unitEconomics")}
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t("analytics.cac")}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">${unitEcon.cac}</p>
              <p className="text-[10px] text-muted-foreground">{t("analytics.costPerAcquisition")}</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t("analytics.ltv")}</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">${unitEcon.ltv}</p>
              <p className="text-[10px] text-muted-foreground">{t("analytics.lifetimeValue")}</p>
            </CardContent>
          </Card>
          <Card className="border-violet-200 dark:border-violet-800">
            <CardContent className="p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t("analytics.ltvCac")}</p>
              <p className="mt-1 text-2xl font-bold text-violet-600">{(unitEcon.ltv / unitEcon.cac).toFixed(1)}x</p>
              <p className="text-[10px] text-muted-foreground">
                {unitEcon.ltv / unitEcon.cac >= 3 ? t("analytics.healthy") : t("analytics.needsWork")}
              </p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 dark:border-amber-800">
            <CardContent className="p-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t("analytics.grossMargin")}</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">{unitEcon.grossMargin}%</p>
              <p className="text-[10px] text-muted-foreground">{t("analytics.afterCogs")}</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
            <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-bold">${unitEcon.aov}</p>
              <p className="text-[10px] text-muted-foreground">{t("analytics.avgOrderValue")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
            <Repeat className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-bold">{unitEcon.churnRate}%</p>
              <p className="text-[10px] text-muted-foreground">{t("analytics.monthlyChurn")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-bold">${unitEcon.arpu}</p>
              <p className="text-[10px] text-muted-foreground">{t("analytics.arpu")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-bold">{unitEcon.paybackMonths}mo</p>
              <p className="text-[10px] text-muted-foreground">{t("analytics.paybackPeriod")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel + Cohort Retention side by side */}
      <div className={cn(
        "mb-4 grid gap-3 lg:grid-cols-2 transition-all duration-500",
        revealStage >= 4 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        {/* Conversion Funnel */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm">
              <PieChart className="h-3.5 w-3.5" /> {t("analytics.conversionFunnel")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={funnelData} layout="vertical" barCategoryGap="20%">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 10 }} width={65} />
                <Tooltip formatter={(v) => typeof v === "number" ? v.toLocaleString() : v} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((_, i) => (
                    <Cell key={i} fill={FUNNEL_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              {funnelData.map((f) => (
                <span key={f.stage}>{f.pct}%</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cohort Retention */}
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Repeat className="h-3.5 w-3.5" /> {t("analytics.cohortRetention")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="retention" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-1 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> {t("analytics.userRetention")}</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> {t("analytics.revenueRetention")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rankings Table */}
      <div className={cn(
        "transition-all duration-500",
        revealStage >= 5 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-3.5 w-3.5" /> {t("analytics.topPerformers")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-1.5">
              {rankings.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/50">
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" :
                    i === 1 ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate font-medium">{item.name}</span>
                  <span className="font-mono text-sm font-bold">{item.value.toLocaleString()}</span>
                  <span className={cn(
                    "flex items-center gap-0.5 text-[10px] font-medium",
                    item.change >= 0 ? "text-emerald-600" : "text-red-500"
                  )}>
                    <ArrowUpRight className={cn("h-2.5 w-2.5", item.change < 0 && "rotate-90")} />
                    {item.change >= 0 ? "+" : ""}{item.change}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
