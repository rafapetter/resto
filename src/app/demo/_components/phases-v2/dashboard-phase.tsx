"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  CheckSquare,
  BookOpen,
  Plug,
  BarChart2,
  AppWindow,
  Globe,
  Smartphone,
  Users,
  Rocket,
  ShoppingCart,
  Search,
} from "lucide-react";
import type { DashboardContent } from "@/lib/demo/types";

const projectSections = [
  { title: "Chat with Resto", description: "Talk with your AI co-founder about anything", icon: MessageSquare, color: "text-emerald-600" },
  { title: "Checklist", description: "Track milestones and project progress", icon: CheckSquare, color: "text-blue-600" },
  { title: "Knowledge Base", description: "Project documentation and context", icon: BookOpen, color: "text-violet-600" },
  { title: "Integrations", description: "Connected services and APIs", icon: Plug, color: "text-amber-600" },
  { title: "Agent Team", description: "Your AI agents and their roles", icon: Users, color: "text-pink-600" },
  { title: "Analytics", description: "Performance metrics and insights", icon: BarChart2, color: "text-cyan-600" },
];

const appsSections = [
  { title: "Web App", description: "Main application (production)", icon: Globe, status: "live", color: "bg-emerald-500" },
  { title: "Mobile App", description: "iOS & Android companion app", icon: Smartphone, status: "building", color: "bg-blue-500" },
  { title: "Admin Panel", description: "Back-office management dashboard", icon: AppWindow, status: "building", color: "bg-violet-500" },
];

type Props = { isPlaying: boolean; onComplete: () => void; content: DashboardContent };

export default function DashboardPhase({ isPlaying, onComplete, content }: Props) {
  const [visibleCards, setVisibleCards] = useState(0);
  const [showApps, setShowApps] = useState(false);
  const [highlightNext, setHighlightNext] = useState(false);
  const totalCards = projectSections.length;

  useEffect(() => {
    if (visibleCards < totalCards) {
      const timer = setTimeout(() => setVisibleCards((v) => v + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [visibleCards, totalCards]);

  useEffect(() => {
    if (visibleCards < totalCards) return;
    const appsTimer = setTimeout(() => setShowApps(true), 600);
    const highlightTimer = setTimeout(() => setHighlightNext(true), 1500);
    const advance = setTimeout(() => { if (isPlaying) onComplete(); }, 3000);
    return () => { clearTimeout(appsTimer); clearTimeout(highlightTimer); clearTimeout(advance); };
  }, [visibleCards, totalCards, isPlaying, onComplete]);

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Project header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
            {content.projectName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{content.projectName}</h1>
              <Badge variant="secondary">{content.projectBadge}</Badge>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Active</Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{content.projectDescription}</p>
          </div>
        </div>
      </div>

      {/* Apps / Products being built */}
      <div className={cn("mb-6 transition-all duration-700", showApps ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Rocket className="h-4 w-4" />
          APPS & PRODUCTS
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {appsSections.map((app) => (
            <Card key={app.title} className="cursor-pointer transition-all hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-white", app.color)}>
                  <app.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{app.title}</p>
                    <Badge variant="outline" className={cn("text-[9px]", app.status === "live" ? "border-emerald-300 text-emerald-600" : "border-blue-300 text-blue-600")}>
                      {app.status === "live" ? "● Live" : "◌ Building"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{app.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Domain purchase */}
        <Card className="mt-3 cursor-pointer border-dashed border-emerald-700/40 bg-emerald-950/20 transition-all hover:border-emerald-600/60 hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Globe className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Buy a Domain</p>
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 text-[9px]">Recommended</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Register a custom domain for your product — Resto handles DNS and SSL automatically</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border bg-muted/50 px-2.5 py-1">
                <Search className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">shopvelocity.com</span>
              </div>
              <Badge variant="outline" className="border-emerald-300 text-emerald-600 text-[9px]">
                <ShoppingCart className="mr-1 h-2.5 w-2.5" />Available
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project sections */}
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">PROJECT TOOLS</h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {projectSections.map((section, i) => (
          <Card
            key={section.title}
            className={cn(
              "cursor-pointer transition-all duration-500",
              i < visibleCards ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              highlightNext && section.title === "Integrations" ? "ring-2 ring-emerald-600 shadow-lg" : "hover:shadow-md"
            )}
            onClick={() => { if (section.title === "Integrations" || section.title === "Chat with Resto") onComplete(); }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <section.icon className={cn("h-5 w-5", section.color)} />
                {section.title}
              </CardTitle>
              <CardDescription className="text-xs">{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {highlightNext && (
        <p className="mt-4 text-center text-sm text-muted-foreground animate-pulse">
          Setting up integrations next...
        </p>
      )}
    </div>
  );
}
