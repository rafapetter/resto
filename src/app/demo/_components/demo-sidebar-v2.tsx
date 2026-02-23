"use client";

import { cn } from "@/lib/utils";
import {
  FolderKanban,
  MessageSquare,
  CheckSquare,
  BookOpen,
  Plug,
  BarChart2,
  CreditCard,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { label: string; key: string; icon: LucideIcon };

const mainNav: NavItem[] = [
  { label: "Projects", key: "projects", icon: FolderKanban },
  { label: "Analytics", key: "analytics", icon: BarChart2 },
  { label: "Billing", key: "billing", icon: CreditCard },
  { label: "Settings", key: "settings", icon: Settings },
];

const projectNav: NavItem[] = [
  { label: "Chat", key: "chat", icon: MessageSquare },
  { label: "Checklist", key: "checklist", icon: CheckSquare },
  { label: "Knowledge Base", key: "knowledge base", icon: BookOpen },
  { label: "Integrations", key: "integrations", icon: Plug },
  { label: "Agents", key: "agents", icon: Users },
];

type Props = {
  activeItem?: string;
  showProjectNav?: boolean;
  projectName: string;
};

export function DemoSidebarV2({ activeItem, showProjectNav = false, projectName }: Props) {
  return (
    <aside className="hidden w-52 shrink-0 border-r bg-muted/30 md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
            R
          </span>
          <span className="font-semibold">Resto</span>
        </div>

        <div className="flex-1 space-y-1 p-3">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          {mainNav.map((item) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                activeItem === item.key
                  ? "bg-accent font-medium"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          ))}

          {showProjectNav && (
            <>
              <p className="mb-2 mt-4 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {projectName}
              </p>
              {projectNav.map((item) => (
                <div
                  key={item.key}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    activeItem === item.key
                      ? "bg-accent font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="border-t p-3">
          <p className="text-center text-xs text-muted-foreground">
            ATR Platform v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
