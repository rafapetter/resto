"use client";

import { useState, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageSquare, CheckSquare, BookOpen, Plug } from "lucide-react";
import type { DashboardContent } from "@/lib/demo/types";

const sections = [
  { title: "Chat", description: "Talk with Resto about your project", icon: MessageSquare },
  { title: "Checklist", description: "Track your project milestones", icon: CheckSquare },
  { title: "Knowledge Base", description: "Project documentation and context", icon: BookOpen },
  { title: "Integrations", description: "Connected services and APIs", icon: Plug },
];

type Props = { isPlaying: boolean; onComplete: () => void; content: DashboardContent };

export default function DashboardPhase({ isPlaying, onComplete, content }: Props) {
  const [visibleCards, setVisibleCards] = useState(0);
  const [highlightChat, setHighlightChat] = useState(false);

  useEffect(() => {
    if (visibleCards < sections.length) {
      const timer = setTimeout(() => setVisibleCards((v) => v + 1), 400);
      return () => clearTimeout(timer);
    }
  }, [visibleCards]);

  useEffect(() => {
    if (visibleCards < sections.length) return;
    const highlight = setTimeout(() => setHighlightChat(true), 800);
    const advance = setTimeout(() => { if (isPlaying) onComplete(); }, 2500);
    return () => { clearTimeout(highlight); clearTimeout(advance); };
  }, [visibleCards, isPlaying, onComplete]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{content.projectName}</h1>
          <Badge variant="secondary">{content.projectBadge}</Badge>
        </div>
        <p className="mt-1 text-muted-foreground">{content.projectDescription}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section, i) => (
          <Card key={section.title} className={cn("cursor-pointer transition-all duration-500", i < visibleCards ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0", highlightChat && section.title === "Chat" ? "ring-2 ring-emerald-600 shadow-lg" : "hover:shadow-md")} onClick={() => { if (section.title === "Chat") onComplete(); }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><section.icon className="h-5 w-5" />{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      {highlightChat && <p className="mt-4 text-center text-sm text-muted-foreground animate-pulse">Click Chat to start talking with Resto...</p>}
    </div>
  );
}
