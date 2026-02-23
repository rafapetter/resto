"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, Database, ArrowRight, Search, Brain, Layers, FileText, FolderOpen, Zap, Check } from "lucide-react";
import type { KnowledgeContent } from "@/lib/demo/types";

const tierColors: Record<string, string> = {
  index: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  summary: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  detail: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const tierBorderColors: Record<string, string> = {
  index: "border-blue-400 dark:border-blue-600",
  summary: "border-green-400 dark:border-green-600",
  detail: "border-orange-400 dark:border-orange-600",
};

const tierGlowColors: Record<string, string> = {
  index: "shadow-blue-500/20",
  summary: "shadow-green-500/20",
  detail: "shadow-orange-500/20",
};

type AnimPhase = "ingesting" | "querying" | "retrieving" | "context-ready" | "browsing";

type Props = { isPlaying: boolean; onComplete: () => void; content: KnowledgeContent };

export default function KnowledgePhase({ isPlaying, onComplete, content }: Props) {
  const [visibleDocs, setVisibleDocs] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animPhase, setAnimPhase] = useState<AnimPhase>("ingesting");
  const [queryHighlight, setQueryHighlight] = useState<number[]>([]);
  const [contextDocs, setContextDocs] = useState<number[]>([]);
  const [agentQuery, setAgentQuery] = useState("");
  const queryRef = useRef<string[]>([
    "What are the latest compliance requirements?",
    "How should I handle this edge case?",
    "What's the recommended procedure?",
  ]);

  // Phase 1: Ingest documents rapidly
  useEffect(() => {
    if (animPhase !== "ingesting") return;
    if (visibleDocs >= content.documents.length) {
      const timer = setTimeout(() => setAnimPhase("querying"), 800);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setVisibleDocs((v) => v + 1), 350);
    return () => clearTimeout(timer);
  }, [animPhase, visibleDocs, content.documents.length]);

  // Phase 2: Agent query animation
  useEffect(() => {
    if (animPhase !== "querying") return;
    const query = queryRef.current[0];
    let charIdx = 0;
    const timer = setInterval(() => {
      charIdx++;
      setAgentQuery(query.slice(0, charIdx));
      if (charIdx >= query.length) {
        clearInterval(timer);
        setTimeout(() => setAnimPhase("retrieving"), 600);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [animPhase]);

  // Phase 3: Highlight retrieved docs (simulate semantic search)
  useEffect(() => {
    if (animPhase !== "retrieving") return;
    // Pick 3 docs across different tiers to highlight
    const indexDoc = content.documents.findIndex((d) => d.tier === "index");
    const summaryDoc = content.documents.findIndex((d) => d.tier === "summary");
    const detailDoc = content.documents.findIndex((d) => d.tier === "detail");
    const highlights = [indexDoc, summaryDoc, detailDoc].filter((i) => i >= 0);

    let step = 0;
    const timer = setInterval(() => {
      if (step < highlights.length) {
        setQueryHighlight((prev) => [...prev, highlights[step]]);
        step++;
      } else {
        clearInterval(timer);
        setContextDocs(highlights);
        setTimeout(() => setAnimPhase("context-ready"), 600);
      }
    }, 400);
    return () => clearInterval(timer);
  }, [animPhase, content.documents]);

  // Phase 4: Context ready → browse mode
  useEffect(() => {
    if (animPhase !== "context-ready") return;
    const timer = setTimeout(() => setAnimPhase("browsing"), 2000);
    return () => clearTimeout(timer);
  }, [animPhase]);

  // Auto-complete
  useEffect(() => {
    if (animPhase === "browsing" && isPlaying) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [animPhase, isPlaying, onComplete]);

  const filteredDocs = content.documents
    .slice(0, visibleDocs)
    .filter((d) => !selectedCategory || d.category === selectedCategory);

  const tierCounts = {
    index: content.documents.slice(0, visibleDocs).filter((d) => d.tier === "index").length,
    summary: content.documents.slice(0, visibleDocs).filter((d) => d.tier === "summary").length,
    detail: content.documents.slice(0, visibleDocs).filter((d) => d.tier === "detail").length,
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 3-Tier Architecture Visual */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
            <Database className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Knowledge Base — Single Source of Truth</h2>
            <p className="text-sm text-muted-foreground">3-tier architecture optimized for AI agent retrieval</p>
          </div>
        </div>

        {/* Tier Pyramid */}
        <div className="flex items-end justify-center gap-3">
          {/* Tier 1: Index */}
          <div className={cn(
            "flex flex-col items-center transition-all duration-500",
            tierCounts.index > 0 ? "opacity-100 translate-y-0" : "opacity-30 translate-y-2"
          )}>
            <div className={cn(
              "flex h-20 w-28 flex-col items-center justify-center rounded-lg border-2 transition-all duration-500",
              tierBorderColors.index,
              animPhase === "retrieving" && queryHighlight.some((i) => content.documents[i]?.tier === "index")
                ? `shadow-lg ${tierGlowColors.index} scale-105`
                : ""
            )}>
              <Layers className="mb-1 h-5 w-5 text-blue-500" />
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Index</span>
              <span className="text-[10px] text-muted-foreground">{tierCounts.index} files</span>
            </div>
            <span className="mt-1 text-[9px] text-muted-foreground">~50 lines</span>
          </div>

          {/* Arrow */}
          <ArrowRight className="mb-8 h-4 w-4 text-muted-foreground" />

          {/* Tier 2: Summary */}
          <div className={cn(
            "flex flex-col items-center transition-all duration-500",
            tierCounts.summary > 0 ? "opacity-100 translate-y-0" : "opacity-30 translate-y-2"
          )}>
            <div className={cn(
              "flex h-24 w-32 flex-col items-center justify-center rounded-lg border-2 transition-all duration-500",
              tierBorderColors.summary,
              animPhase === "retrieving" && queryHighlight.some((i) => content.documents[i]?.tier === "summary")
                ? `shadow-lg ${tierGlowColors.summary} scale-105`
                : ""
            )}>
              <FileText className="mb-1 h-5 w-5 text-green-500" />
              <span className="text-xs font-bold text-green-700 dark:text-green-300">Summary</span>
              <span className="text-[10px] text-muted-foreground">{tierCounts.summary} files</span>
            </div>
            <span className="mt-1 text-[9px] text-muted-foreground">~2,000 chars</span>
          </div>

          {/* Arrow */}
          <ArrowRight className="mb-8 h-4 w-4 text-muted-foreground" />

          {/* Tier 3: Detail */}
          <div className={cn(
            "flex flex-col items-center transition-all duration-500",
            tierCounts.detail > 0 ? "opacity-100 translate-y-0" : "opacity-30 translate-y-2"
          )}>
            <div className={cn(
              "flex h-28 w-36 flex-col items-center justify-center rounded-lg border-2 transition-all duration-500",
              tierBorderColors.detail,
              animPhase === "retrieving" && queryHighlight.some((i) => content.documents[i]?.tier === "detail")
                ? `shadow-lg ${tierGlowColors.detail} scale-105`
                : ""
            )}>
              <FolderOpen className="mb-1 h-5 w-5 text-orange-500" />
              <span className="text-xs font-bold text-orange-700 dark:text-orange-300">Detail</span>
              <span className="text-[10px] text-muted-foreground">{tierCounts.detail} files</span>
            </div>
            <span className="mt-1 text-[9px] text-muted-foreground">~50,000 chars</span>
          </div>
        </div>

        {/* Agent Query Banner */}
        {(animPhase === "querying" || animPhase === "retrieving" || animPhase === "context-ready") && (
          <div className={cn(
            "mt-5 rounded-lg border p-3 transition-all duration-500",
            animPhase === "context-ready"
              ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950"
              : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
          )}>
            <div className="flex items-center gap-2 text-sm">
              {animPhase === "context-ready" ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-emerald-700 dark:text-emerald-300">Context assembled — {contextDocs.length} documents retrieved across all tiers</span>
                </>
              ) : (
                <>
                  {animPhase === "querying" ? (
                    <Brain className="h-4 w-4 animate-pulse text-blue-600" />
                  ) : (
                    <Search className="h-4 w-4 animate-bounce text-blue-600" />
                  )}
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    {animPhase === "querying" ? "Agent query: " : "Semantic search: "}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400">{agentQuery}</span>
                  {animPhase === "querying" && <span className="inline-block h-4 w-0.5 animate-pulse bg-blue-600" />}
                </>
              )}
            </div>
            {animPhase === "retrieving" && (
              <div className="mt-2 flex items-center gap-2">
                <Zap className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Searching with pgvector semantic similarity... {queryHighlight.length} matches found
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Categories sidebar */}
        <div className="w-full space-y-2 lg:w-56">
          <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn("flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all", !selectedCategory ? "border-emerald-600 bg-emerald-50 font-medium dark:bg-emerald-950" : "hover:bg-muted")}
          >
            All Documents
            <Badge variant="secondary">{content.documents.slice(0, visibleDocs).length}</Badge>
          </button>
          {content.categories.map((cat) => {
            const catCount = content.documents.slice(0, visibleDocs).filter((d) => d.category === cat.name).length;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={cn("flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all", selectedCategory === cat.name ? "border-emerald-600 bg-emerald-50 font-medium dark:bg-emerald-950" : "hover:bg-muted")}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </span>
                <Badge variant="secondary">{catCount}</Badge>
              </button>
            );
          })}
        </div>

        {/* Documents */}
        <div className="flex-1 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Documents ({filteredDocs.length})</h3>
          {filteredDocs.map((doc, i) => {
            const globalIdx = content.documents.indexOf(doc);
            const isHighlighted = queryHighlight.includes(globalIdx);
            const isContext = contextDocs.includes(globalIdx);
            return (
              <Card
                key={i}
                className={cn(
                  "transition-all duration-500 animate-in fade-in slide-in-from-bottom-2",
                  isHighlighted && "ring-2 ring-blue-500 shadow-lg shadow-blue-500/10",
                  isContext && animPhase === "context-ready" && "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/10"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className={cn(
                          "h-4 w-4 transition-colors duration-300",
                          isHighlighted || isContext ? "text-emerald-600" : "text-muted-foreground"
                        )} />
                        <span className="text-sm font-medium">{doc.title}</span>
                        {isContext && animPhase === "context-ready" && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                            <Zap className="h-2.5 w-2.5" />
                            In context
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.lines} lines</span>
                        <span>&middot;</span>
                        <span>{doc.category}</span>
                      </div>
                      {doc.crossRefs && doc.crossRefs.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {doc.crossRefs.map((ref) => (
                            <span key={ref} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px]">
                              <ArrowRight className="h-2.5 w-2.5" />
                              {ref}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Badge className={cn("shrink-0 text-[10px]", tierColors[doc.tier])}>{doc.tier}</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredDocs.length === 0 && visibleDocs > 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">No documents in this category yet.</p>
          )}
          {animPhase === "ingesting" && visibleDocs < content.documents.length && (
            <div className="flex items-center justify-center gap-2 py-2">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "0ms" }} />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "150ms" }} />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: "300ms" }} />
              <span className="ml-2 text-xs text-muted-foreground">Indexing documents...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
