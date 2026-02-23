"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, Loader2, Clock, BookOpen, FileCode } from "lucide-react";

// ─── Mock data ──────────────────────────────────────────────────────

type ChecklistItem = {
  title: string;
  stage: "plan" | "build" | "launch";
  status: "completed" | "in_progress" | "pending";
};

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { title: "Define menu data schema", stage: "plan", status: "completed" },
  { title: "Design online ordering flow", stage: "plan", status: "completed" },
  { title: "Set up database tables", stage: "build", status: "completed" },
  { title: "Build menu management API", stage: "build", status: "in_progress" },
  { title: "Create ordering frontend", stage: "build", status: "pending" },
  { title: "Integrate Stripe payments", stage: "build", status: "pending" },
  { title: "Build reservation system", stage: "build", status: "pending" },
  { title: "Deploy preview to Vercel", stage: "launch", status: "pending" },
];

const KB_ENTRIES = [
  { title: "Menu Schema & Data Model", tier: "index", lines: 45 },
  { title: "API Routes Documentation", tier: "summary", lines: 128 },
  { title: "Restaurant Operations Guide", tier: "detail", lines: 312 },
];

const CODE_LINES = [
  'import { db } from "@/server/db";',
  'import { menus, menuItems } from "@/server/db/schema";',
  "",
  "export async function getMenu(restaurantId: string) {",
  "  const menu = await db.query.menus.findFirst({",
  "    where: (m, { eq }) => eq(m.restaurantId, restaurantId),",
  "    with: {",
  "      items: {",
  "        orderBy: (items, { asc }) => [asc(items.position)],",
  "      },",
  "    },",
  "  });",
  "",
  "  return menu;",
  "}",
  "",
  "export async function addMenuItem(input: {",
  "  menuId: string;",
  "  name: string;",
  "  price: number;",
  "  category: string;",
  "  description?: string;",
  "}) {",
  "  const [item] = await db",
  "    .insert(menuItems)",
  "    .values({",
  "      ...input,",
  '      position: 0, // auto-sorted',
  "    })",
  "    .returning();",
  "",
  "  return item;",
  "}",
];

const tierColors: Record<string, string> = {
  index: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  summary:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  detail:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const stageColors: Record<string, string> = {
  plan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  build:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  launch:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

// ─── Component ──────────────────────────────────────────────────────

type Props = {
  isPlaying: boolean;
  onComplete: () => void;
};

export function BuildPhase({ isPlaying, onComplete }: Props) {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [codeVisible, setCodeVisible] = useState(0);
  const [kbVisible, setKbVisible] = useState(0);
  const [tick, setTick] = useState(0);

  // Animate: progress checklist items one at a time
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Advance checklist
    setChecklist((prev) => {
      const next = [...prev];
      const inProgress = next.findIndex((i) => i.status === "in_progress");
      const firstPending = next.findIndex((i) => i.status === "pending");

      if (inProgress >= 0 && tick > 0 && tick % 2 === 0) {
        next[inProgress] = { ...next[inProgress], status: "completed" };
        if (firstPending >= 0) {
          next[firstPending] = { ...next[firstPending], status: "in_progress" };
        }
      }
      return next;
    });

    // Advance code lines
    setCodeVisible((v) => Math.min(v + 2, CODE_LINES.length));

    // Advance KB entries
    if (tick > 2) setKbVisible((v) => Math.min(v + 1, KB_ENTRIES.length));
  }, [tick]);

  const completed = checklist.filter((i) => i.status === "completed").length;
  const progress = Math.round((completed / checklist.length) * 100);

  // Auto-advance when all done
  useEffect(() => {
    if (completed >= checklist.length - 1 && isPlaying) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [completed, checklist.length, isPlaying, onComplete]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 lg:flex-row">
      {/* Left: Checklist + Knowledge Base */}
      <div className="flex-1 space-y-4">
        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Build Progress</span>
            <span className="font-medium">
              {completed} of {checklist.length} complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Checklist */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {checklist.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 transition-all",
                  item.status === "completed" && "opacity-60"
                )}
              >
                <div className="flex items-center gap-2">
                  {item.status === "completed" ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : item.status === "in_progress" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      item.status === "completed" && "line-through"
                    )}
                  >
                    {item.title}
                  </span>
                </div>
                <Badge className={cn("text-[10px]", stageColors[item.stage])}>
                  {item.stage}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4" />
              Knowledge Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {KB_ENTRIES.slice(0, kbVisible).map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border px-3 py-2 transition-all animate-in fade-in slide-in-from-bottom-2"
              >
                <span className="text-sm">{entry.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {entry.lines} lines
                  </span>
                  <Badge className={cn("text-[10px]", tierColors[entry.tier])}>
                    {entry.tier}
                  </Badge>
                </div>
              </div>
            ))}
            {kbVisible === 0 && (
              <p className="py-2 text-center text-sm text-muted-foreground">
                Populating knowledge base...
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Code editor mockup */}
      <div className="flex-1">
        <Card className="h-full bg-zinc-950 text-zinc-100 dark:bg-zinc-900">
          <CardHeader className="border-b border-zinc-800 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-normal text-zinc-400">
              <FileCode className="h-4 w-4" />
              src/server/services/menu.ts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
              <code>
                {CODE_LINES.slice(0, codeVisible).map((line, i) => (
                  <div key={i} className="flex">
                    <span className="mr-4 inline-block w-6 select-none text-right text-zinc-600">
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        i === codeVisible - 1 && "animate-pulse",
                        line.includes("import") && "text-purple-400",
                        line.includes("export") && "text-blue-400",
                        line.includes("async") && "text-blue-400",
                        line.includes("await") && "text-blue-400",
                        line.includes("//") && "text-zinc-500",
                        line.includes('"') && "text-emerald-400",
                        !line.includes("import") &&
                          !line.includes("export") &&
                          !line.includes("async") &&
                          !line.includes("await") &&
                          !line.includes("//") &&
                          !line.includes('"') &&
                          "text-zinc-300"
                      )}
                    >
                      {line || "\u00A0"}
                    </span>
                  </div>
                ))}
                {codeVisible < CODE_LINES.length && (
                  <div className="mt-1 flex items-center gap-1 text-zinc-600">
                    <span className="mr-4 inline-block w-6 text-right">
                      {codeVisible + 1}
                    </span>
                    <span className="inline-block h-4 w-2 animate-pulse bg-emerald-500" />
                  </div>
                )}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
