"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, Loader2, Clock, Terminal, FileCode, Eye } from "lucide-react";
import { FileTreeView } from "../shared/file-tree-view";
import type { BuildContent, FileTreeNode, ViewMode, TechBuildOverlay } from "@/lib/demo/types";

const stageColors: Record<string, string> = {
  plan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  build: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  launch: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  grow: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

function countTreeNodes(nodes: FileTreeNode[]): number {
  let count = 0;
  for (const node of nodes) {
    count++;
    if (node.children) count += countTreeNodes(node.children);
  }
  return count;
}

// ─── Code Editor Simulation ─────────────────────────────────────────

function CodeEditorSim({
  snippets,
  currentIdx,
  charProgress,
}: {
  snippets: { filename: string; language: string; code: string }[];
  currentIdx: number;
  charProgress: number;
}) {
  const snippet = snippets[currentIdx];
  if (!snippet) return null;

  const visibleCode = snippet.code.slice(0, charProgress);
  const lines = visibleCode.split("\n");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-zinc-800 bg-zinc-900">
        {snippets.map((s, i) => (
          <div
            key={s.filename}
            className={cn(
              "flex items-center gap-1.5 border-r border-zinc-800 px-3 py-1.5 text-xs",
              i === currentIdx
                ? "bg-zinc-950 text-white"
                : "text-zinc-500"
            )}
          >
            <FileCode className="h-3 w-3" />
            {s.filename}
          </div>
        ))}
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-y-auto p-0 font-mono text-xs leading-relaxed">
        <div className="flex">
          {/* Line numbers */}
          <div className="shrink-0 select-none border-r border-zinc-800 bg-zinc-900/50 py-2 text-right text-zinc-600">
            {lines.map((_, i) => (
              <div key={i} className="px-3 leading-5">{i + 1}</div>
            ))}
          </div>
          {/* Code content */}
          <pre className="flex-1 overflow-x-auto py-2 pl-4 pr-4">
            <code>
              {lines.map((line, i) => (
                <div key={i} className="leading-5">
                  <span className={getLineColor(line)}>{line}</span>
                  {i === lines.length - 1 && charProgress < snippet.code.length && (
                    <span className="inline-block h-4 w-1.5 animate-pulse bg-emerald-400 align-middle" />
                  )}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function getLineColor(line: string): string {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*"))
    return "text-zinc-500";
  if (trimmed.startsWith("import") || trimmed.startsWith("export") || trimmed.startsWith("from"))
    return "text-violet-400";
  if (trimmed.startsWith("const") || trimmed.startsWith("let") || trimmed.startsWith("type") || trimmed.startsWith("interface"))
    return "text-blue-400";
  if (trimmed.startsWith("return") || trimmed.startsWith("async") || trimmed.startsWith("await") || trimmed.startsWith("function"))
    return "text-amber-400";
  if (trimmed.startsWith("<") || trimmed.includes("className"))
    return "text-emerald-300";
  return "text-zinc-200";
}

// ─── Terminal Simulation ────────────────────────────────────────────

function TerminalSim({
  commands,
  visibleIdx,
}: {
  commands: { command: string; output: string }[];
  visibleIdx: number;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-3 py-1.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
        <span className="text-[10px] text-zinc-500">Terminal</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
        {commands.slice(0, visibleIdx).map((cmd, i) => (
          <div key={i} className="mb-2">
            <div className="text-emerald-400">$ {cmd.command}</div>
            <div className="whitespace-pre-wrap text-zinc-500">{cmd.output}</div>
          </div>
        ))}
        {visibleIdx < commands.length && (
          <span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-400" />
        )}
      </div>
    </div>
  );
}

// ─── Preview Simulation ─────────────────────────────────────────────

function PreviewSim({ progress }: { progress: number }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center gap-2 border-b px-3 py-1.5 dark:border-zinc-700">
        <Eye className="h-3 w-3 text-zinc-400" />
        <span className="text-[10px] text-zinc-500">Live Preview</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-4">
        {/* Mini app preview */}
        <div className="w-full max-w-[200px] space-y-2">
          {/* Nav bar */}
          <div className={cn("h-3 w-full rounded-sm bg-emerald-200 transition-opacity duration-500 dark:bg-emerald-800", progress > 10 ? "opacity-100" : "opacity-0")} />
          {/* Hero section */}
          <div className={cn("h-8 w-full rounded-sm bg-gradient-to-r from-emerald-100 to-blue-100 transition-opacity duration-500 dark:from-emerald-900 dark:to-blue-900", progress > 25 ? "opacity-100" : "opacity-0")} />
          {/* Cards grid */}
          <div className={cn("grid grid-cols-2 gap-1 transition-opacity duration-500", progress > 40 ? "opacity-100" : "opacity-0")}>
            <div className="h-6 rounded-sm bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-6 rounded-sm bg-zinc-100 dark:bg-zinc-800" />
            <div className={cn("h-6 rounded-sm bg-zinc-100 transition-opacity duration-500 dark:bg-zinc-800", progress > 55 ? "opacity-100" : "opacity-0")} />
            <div className={cn("h-6 rounded-sm bg-zinc-100 transition-opacity duration-500 dark:bg-zinc-800", progress > 55 ? "opacity-100" : "opacity-0")} />
          </div>
          {/* Data table */}
          <div className={cn("space-y-0.5 transition-opacity duration-500", progress > 70 ? "opacity-100" : "opacity-0")}>
            <div className="h-2 w-full rounded-sm bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2 w-3/4 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2 w-5/6 rounded-sm bg-zinc-200 dark:bg-zinc-700" />
          </div>
          {/* Footer */}
          <div className={cn("h-2 w-full rounded-sm bg-zinc-100 transition-opacity duration-500 dark:bg-zinc-800", progress > 85 ? "opacity-100" : "opacity-0")} />
        </div>
        <p className="text-[10px] text-zinc-500">{Math.min(progress, 100)}% built</p>
      </div>
    </div>
  );
}

// ─── Test results ───────────────────────────────────────────────────

function TestResults({
  tests,
  passedCount,
}: {
  tests: { name: string; passed: boolean }[];
  passedCount: number;
}) {
  return (
    <div className="space-y-1">
      {tests.slice(0, passedCount).map((test, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <Check className="h-3 w-3 text-emerald-500" />
          <span className="text-zinc-400">{test.name}</span>
          <span className="text-emerald-500">PASS</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Build Phase ───────────────────────────────────────────────

type Props = {
  isPlaying: boolean;
  onComplete: () => void;
  content: BuildContent;
  viewMode?: ViewMode;
  techOverlay?: TechBuildOverlay;
};

export default function BuildPhase({ isPlaying, onComplete, content, viewMode = "magic", techOverlay }: Props) {
  const [checklist, setChecklist] = useState(() =>
    content.checklist.map((item) => ({
      ...item,
      status: item.status === "complete" ? "completed" : item.status === "active" ? "in_progress" : item.status,
    }))
  );
  const [fileVisible, setFileVisible] = useState(0);
  const totalFiles = countTreeNodes(content.fileTree);
  const checklistTickRef = useRef(0);

  // Tech mode state
  const [codeSnippetIdx, setCodeSnippetIdx] = useState(0);
  const [charProgress, setCharProgress] = useState(0);
  const [terminalCmdIdx, setTerminalCmdIdx] = useState(0);
  const [testPassedCount, setTestPassedCount] = useState(0);

  const snippets = techOverlay?.codeSnippets ?? defaultSnippets;
  const terminalCmds = techOverlay?.terminalCommands ?? defaultTerminalCmds;
  const tests = techOverlay?.testResults ?? defaultTests;

  // File tree animation
  useEffect(() => {
    if (fileVisible >= totalFiles) return;
    const timer = setTimeout(() => setFileVisible((v) => v + 1), 120);
    return () => clearTimeout(timer);
  }, [fileVisible, totalFiles]);

  // Code typing animation (tech/split mode)
  useEffect(() => {
    if (viewMode === "magic") return;
    const snippet = snippets[codeSnippetIdx];
    if (!snippet) return;
    if (charProgress >= snippet.code.length) {
      const timer = setTimeout(() => {
        if (codeSnippetIdx < snippets.length - 1) {
          setCodeSnippetIdx((i) => i + 1);
          setCharProgress(0);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
    const charsPerTick = 3;
    const timer = setTimeout(() => setCharProgress((c) => Math.min(c + charsPerTick, snippet.code.length)), 25);
    return () => clearTimeout(timer);
  }, [viewMode, codeSnippetIdx, charProgress, snippets]);

  // Terminal commands (tech/split mode)
  useEffect(() => {
    if (viewMode === "magic") return;
    if (terminalCmdIdx >= terminalCmds.length) return;
    const delay = terminalCmds[terminalCmdIdx]?.delay ?? 2000;
    const timer = setTimeout(() => setTerminalCmdIdx((i) => i + 1), delay);
    return () => clearTimeout(timer);
  }, [viewMode, terminalCmdIdx, terminalCmds]);

  // Test results
  useEffect(() => {
    if (viewMode === "magic") return;
    if (testPassedCount >= tests.length) return;
    const timer = setTimeout(() => setTestPassedCount((c) => c + 1), 1800);
    return () => clearTimeout(timer);
  }, [viewMode, testPassedCount, tests]);

  // Checklist sync
  useEffect(() => {
    const filesPerItem = Math.max(2, Math.floor(totalFiles / checklist.length));
    const targetTick = Math.floor(fileVisible / filesPerItem);
    if (targetTick > checklistTickRef.current) {
      checklistTickRef.current = targetTick;
      setChecklist((prev) => {
        const next = [...prev];
        const inProgress = next.findIndex((i) => i.status === "in_progress");
        const firstPending = next.findIndex((i) => i.status === "pending");
        if (inProgress >= 0) {
          next[inProgress] = { ...next[inProgress], status: "completed" };
          if (firstPending >= 0) next[firstPending] = { ...next[firstPending], status: "in_progress" };
        } else if (firstPending >= 0) {
          next[firstPending] = { ...next[firstPending], status: "in_progress" };
        }
        return next;
      });
    }
  }, [fileVisible, totalFiles, checklist.length]);

  const completed = checklist.filter((i) => i.status === "completed").length;
  const progress = Math.round(
    ((fileVisible / totalFiles) * 0.6 + (completed / checklist.length) * 0.4) * 100
  );

  useEffect(() => {
    if (fileVisible >= totalFiles && isPlaying) {
      setChecklist((prev) => prev.map((item) => ({ ...item, status: "completed" })));
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [fileVisible, totalFiles, isPlaying, onComplete]);

  // ─── Magic View ─────────────────────────────────────────────────
  const magicView = (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 lg:flex-row">
      <div className="flex-1 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Build Progress</span>
            <span className="font-medium">{Math.min(progress, 100)}%</span>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-2" />
        </div>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {checklist.map((item, i) => (
              <div key={i} className={cn("flex items-center justify-between rounded-lg border px-3 py-2 transition-all", item.status === "completed" && "opacity-60")}>
                <div className="flex items-center gap-2">
                  {item.status === "completed" ? <Check className="h-4 w-4 text-emerald-600" /> : item.status === "in_progress" ? <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
                  <span className={cn("text-sm", item.status === "completed" && "line-through")}>{item.title}</span>
                </div>
                <Badge className={cn("text-[10px]", stageColors[item.stage] || "")}>{item.stage}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Preview for magic mode */}
        <div className="h-48">
          <PreviewSim progress={progress} />
        </div>
      </div>
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">&gt;_</span>
              Project Structure
              <span className="ml-auto text-xs font-normal text-muted-foreground">{fileVisible} / {totalFiles} files</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto p-3">
            <FileTreeView tree={content.fileTree} visibleCount={fileVisible} />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ─── Tech View ──────────────────────────────────────────────────
  const techView = (
    <div className="flex h-full flex-col gap-2 overflow-hidden p-2">
      {/* Top: Code editor + file tree */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Code editor */}
        <div className="flex-[2]">
          <CodeEditorSim
            snippets={snippets}
            currentIdx={codeSnippetIdx}
            charProgress={charProgress}
          />
        </div>
        {/* File tree */}
        <div className="flex-1 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-500">
            <FileCode className="h-3 w-3" />
            Explorer
            <span className="ml-auto text-emerald-400">{fileVisible}/{totalFiles}</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2">
            <FileTreeView tree={content.fileTree} visibleCount={fileVisible} />
          </div>
        </div>
      </div>
      {/* Bottom: Terminal + Tests */}
      <div className="flex h-40 gap-2">
        <div className="flex-1">
          <TerminalSim commands={terminalCmds} visibleIdx={terminalCmdIdx} />
        </div>
        <div className="w-64 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
            <Terminal className="h-3 w-3" />
            Test Results
            <Badge className="ml-auto bg-emerald-900 text-[9px] text-emerald-300">
              {testPassedCount}/{tests.length} passed
            </Badge>
          </div>
          <TestResults tests={tests} passedCount={testPassedCount} />
        </div>
      </div>
    </div>
  );

  // ─── Split View ─────────────────────────────────────────────────
  if (viewMode === "split") {
    return (
      <div className="flex h-full overflow-hidden">
        <div className="flex-1 overflow-hidden border-r border-zinc-300 dark:border-zinc-700">
          <div className="bg-blue-600 px-3 py-1 text-center text-[10px] font-bold tracking-widest text-white">
            THE MAGIC
          </div>
          {magicView}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="bg-red-600 px-3 py-1 text-center text-[10px] font-bold tracking-widest text-white">
            UNDER THE HOOD
          </div>
          {techView}
        </div>
      </div>
    );
  }

  return viewMode === "tech" ? techView : magicView;
}

// ─── Default tech content (used when no techOverlay provided) ────

const defaultSnippets = [
  {
    filename: "page.tsx",
    language: "tsx",
    code: `import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { MetricsGrid } from "@/components/metrics-grid";
import { RecentActivity } from "@/components/recent-activity";

export default async function DashboardPage() {
  return (
    <DashboardShell>
      <Suspense fallback={<MetricsGrid.Skeleton />}>
        <MetricsGrid />
      </Suspense>
      <Suspense fallback={<RecentActivity.Skeleton />}>
        <RecentActivity limit={10} />
      </Suspense>
    </DashboardShell>
  );
}`,
  },
  {
    filename: "api/route.ts",
    language: "ts",
    code: `import { z } from "zod";
import { db } from "@/lib/db";
import { items } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const { limit, offset } = querySchema.parse(Object.fromEntries(searchParams));

  const results = await db
    .select()
    .from(items)
    .where(eq(items.userId, userId))
    .orderBy(desc(items.createdAt))
    .limit(limit)
    .offset(offset);

  return Response.json({ data: results });
}`,
  },
  {
    filename: "schema.ts",
    language: "ts",
    code: `import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id),
  title: text("title").notNull(),
  priority: integer("priority").default(0),
  completed: boolean("completed").default(false),
  assignedAgent: text("assigned_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});`,
  },
];

const defaultTerminalCmds = [
  { command: "pnpm install", output: "Packages: +287\nProgress: resolved 412, reused 380, downloaded 32\ndone in 4.2s", delay: 2000 },
  { command: "pnpm drizzle-kit push", output: "Pushing schema changes...\n✓ projects table created\n✓ tasks table created\n✓ 2 tables synced", delay: 3500 },
  { command: "pnpm test", output: "Running 14 test suites...\n✓ API routes (6 tests)\n✓ Components (5 tests)\n✓ Utils (3 tests)\n\nAll 14 tests passed", delay: 5000 },
  { command: "pnpm build", output: "▲ Next.js 16.0.0\n✓ Compiled successfully in 3.2s\n\nRoute (app)         Size\n○ /                 5.4 kB\n○ /dashboard        7.2 kB\nƒ /api/[...route]   2.1 kB", delay: 7000 },
];

const defaultTests = [
  { name: "API: GET /api/items returns 200", passed: true },
  { name: "API: POST /api/items validates input", passed: true },
  { name: "API: unauthorized returns 401", passed: true },
  { name: "Component: Dashboard renders metrics", passed: true },
  { name: "Component: Table sorts correctly", passed: true },
  { name: "Component: Form validates fields", passed: true },
  { name: "DB: Schema migrations apply cleanly", passed: true },
  { name: "E2E: User can create a new item", passed: true },
];
