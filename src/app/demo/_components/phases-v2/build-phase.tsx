"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, Loader2, Clock } from "lucide-react";
import { FileTreeView } from "../shared/file-tree-view";
import type { BuildContent, FileTreeNode } from "@/lib/demo/types";

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

type Props = { isPlaying: boolean; onComplete: () => void; content: BuildContent };

export default function BuildPhase({ isPlaying, onComplete, content }: Props) {
  const [checklist, setChecklist] = useState(() =>
    content.checklist.map((item) => ({
      ...item,
      status: item.status === "complete" ? "completed" : item.status === "active" ? "in_progress" : item.status,
    }))
  );
  const [fileVisible, setFileVisible] = useState(0);
  const totalFiles = countTreeNodes(content.fileTree);
  const checklistTickRef = useRef(0);

  // Fast file tree animation — 120ms per file
  useEffect(() => {
    if (fileVisible >= totalFiles) return;
    const timer = setTimeout(() => setFileVisible((v) => v + 1), 120);
    return () => clearTimeout(timer);
  }, [fileVisible, totalFiles]);

  // Checklist advances every ~4 files (tied to file progress)
  useEffect(() => {
    const filesPerChecklistItem = Math.max(2, Math.floor(totalFiles / checklist.length));
    const targetTick = Math.floor(fileVisible / filesPerChecklistItem);

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
      // Mark remaining checklist items complete
      setChecklist((prev) => prev.map((item) => ({ ...item, status: "completed" })));
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [fileVisible, totalFiles, isPlaying, onComplete]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 lg:flex-row">
      {/* Left: Checklist */}
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
      </div>

      {/* Right: File tree */}
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                &gt;_
              </span>
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
}
