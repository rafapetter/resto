"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, Folder, FileCode, FileText, File } from "lucide-react";
import type { FileTreeNode } from "@/lib/demo/types";
import { useI18n } from "@/lib/demo/i18n/context";

function getFileIcon(name: string) {
  if (name.endsWith(".tsx") || name.endsWith(".ts")) return FileCode;
  if (name.endsWith(".md") || name.endsWith(".json")) return FileText;
  return File;
}

function flattenTree(
  nodes: FileTreeNode[],
  depth: number = 0
): { node: FileTreeNode; depth: number }[] {
  const result: { node: FileTreeNode; depth: number }[] = [];
  for (const node of nodes) {
    result.push({ node, depth });
    if (node.type === "folder" && node.children) {
      result.push(...flattenTree(node.children, depth + 1));
    }
  }
  return result;
}

type Props = {
  tree: FileTreeNode[];
  visibleCount: number;
};

export function FileTreeView({ tree, visibleCount }: Props) {
  const { t } = useI18n();
  const flat = flattenTree(tree);

  return (
    <div className="space-y-0.5 font-mono text-xs">
      {flat.slice(0, visibleCount).map((item, i) => {
        const isLast = i === visibleCount - 1;
        const isFolder = item.node.type === "folder";
        const Icon = isFolder ? Folder : getFileIcon(item.node.name);

        return (
          <div
            key={`${item.depth}-${item.node.name}-${i}`}
            className={cn(
              "flex items-center gap-1.5 rounded px-2 py-1 transition-all",
              isLast && "bg-emerald-50 dark:bg-emerald-950"
            )}
            style={{ paddingLeft: `${item.depth * 16 + 8}px` }}
          >
            {isFolder && (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            )}
            <Icon
              className={cn(
                "h-3.5 w-3.5",
                isFolder
                  ? "text-blue-500"
                  : item.node.name.endsWith(".tsx")
                    ? "text-blue-400"
                    : item.node.name.endsWith(".ts")
                      ? "text-emerald-500"
                      : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                isFolder ? "font-medium" : "text-muted-foreground",
                isLast && "text-emerald-600 dark:text-emerald-400"
              )}
            >
              {item.node.name}
            </span>
            {isLast && (
              <span className="ml-auto text-[10px] text-emerald-600">
                {t("fileTree.creating")}
              </span>
            )}
          </div>
        );
      })}
      {visibleCount < flat.length && (
        <div className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground">
          <span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-500" />
        </div>
      )}
    </div>
  );
}
