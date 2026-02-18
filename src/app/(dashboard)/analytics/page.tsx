"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DollarSign, Zap, Activity, TrendingUp } from "lucide-react";

const DAYS_OPTIONS = [7, 14, 30, 90] as const;
type Days = (typeof DAYS_OPTIONS)[number];

const MODEL_COLORS: Record<string, string> = {
  "claude-opus-4-5-20250514": "#6366f1",
  "claude-sonnet-4-5-20250929": "#8b5cf6",
  "claude-haiku-4-5-20251001": "#a78bfa",
  "gemini-2.0-flash": "#10b981",
};
const DEFAULT_COLOR = "#94a3b8";

function formatCost(usd: number): string {
  if (usd < 0.01) return `$${(usd * 100).toFixed(4)}¢`;
  return `$${usd.toFixed(4)}`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const [days, setDays] = useState<Days>(30);
  const trpc = useTRPC();

  const summaryQ = useQuery(trpc.analytics.summary.queryOptions({ days }));
  const costByDayQ = useQuery(trpc.analytics.costByDay.queryOptions({ days }));
  const costByModelQ = useQuery(trpc.analytics.costByModel.queryOptions({ days }));
  const costByTaskQ = useQuery(trpc.analytics.costByTaskType.queryOptions({ days }));

  const summary = summaryQ.data;
  const loading = summaryQ.isLoading;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            LLM usage and cost breakdown.
          </p>
        </div>
        <div className="flex gap-2">
          {DAYS_OPTIONS.map((d) => (
            <Button
              key={d}
              variant={days === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDays(d)}
            >
              {d}d
            </Button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Cost"
          value={formatCost(summary?.totalCostUsd ?? 0)}
          sub={`Last ${days} days`}
          icon={DollarSign}
          loading={loading}
        />
        <StatCard
          title="Total Requests"
          value={(summary?.totalRequests ?? 0).toLocaleString()}
          sub="LLM API calls"
          icon={Activity}
          loading={loading}
        />
        <StatCard
          title="Input Tokens"
          value={formatTokens(summary?.totalInputTokens ?? 0)}
          sub="Prompt tokens"
          icon={Zap}
          loading={loading}
        />
        <StatCard
          title="Output Tokens"
          value={formatTokens(summary?.totalOutputTokens ?? 0)}
          sub="Completion tokens"
          icon={TrendingUp}
          loading={loading}
        />
      </div>

      {/* Cost over time */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cost over time</CardTitle>
          </CardHeader>
          <CardContent>
            {costByDayQ.isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : costByDayQ.data?.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No data yet. Usage will appear here after your first LLM call.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={costByDayQ.data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => v.slice(5)} // MM-DD
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) => `$${v.toFixed(3)}`}
                  />
                  <Tooltip
                    formatter={(v) => [formatCost(Number(v ?? 0)), "Cost"]}
                    labelFormatter={(l) => `Date: ${String(l)}`}
                  />
                  <Bar dataKey="costUsd" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Cost by model — pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cost by model</CardTitle>
          </CardHeader>
          <CardContent>
            {costByModelQ.isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : costByModelQ.data?.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={costByModelQ.data}
                    dataKey="costUsd"
                    nameKey="model"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${String(name ?? "").split("-").slice(1, 3).join(" ")} ${((Number(percent ?? 0)) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {costByModelQ.data?.map((entry) => (
                      <Cell
                        key={entry.model}
                        fill={MODEL_COLORS[entry.model] ?? DEFAULT_COLOR}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [formatCost(Number(v ?? 0)), "Cost"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Model breakdown table */}
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Model breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {costByModelQ.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : costByModelQ.data?.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {costByModelQ.data?.map((row) => (
                  <div
                    key={row.model}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: MODEL_COLORS[row.model] ?? DEFAULT_COLOR }}
                      />
                      <span className="font-mono text-xs">{row.model}</span>
                    </div>
                    <div className="flex gap-4 text-muted-foreground">
                      <span>{row.requests} req</span>
                      <span className="font-medium text-foreground">
                        {formatCost(row.costUsd)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task type breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Cost by task type</CardTitle>
          </CardHeader>
          <CardContent>
            {costByTaskQ.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : costByTaskQ.data?.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <div className="space-y-2">
                {costByTaskQ.data?.map((row) => (
                  <div
                    key={row.taskType}
                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                  >
                    <span className="capitalize">{row.taskType}</span>
                    <div className="flex gap-4 text-muted-foreground">
                      <span>{row.requests} req</span>
                      <span className="font-medium text-foreground">
                        {formatCost(row.costUsd)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
