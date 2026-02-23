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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = { label: string; icon: LucideIcon; active?: boolean };

const mainNav: NavItem[] = [
  { label: "Projects", icon: FolderKanban, active: true },
  { label: "Analytics", icon: BarChart2 },
  { label: "Billing", icon: CreditCard },
  { label: "Settings", icon: Settings },
];

const projectNav: NavItem[] = [
  { label: "Chat", icon: MessageSquare },
  { label: "Checklist", icon: CheckSquare },
  { label: "Knowledge Base", icon: BookOpen },
  { label: "Integrations", icon: Plug },
];

type Props = {
  activeItem?: string;
  showProjectNav?: boolean;
};

export function DemoSidebar({ activeItem, showProjectNav = false }: Props) {
  return (
    <aside className="hidden w-56 shrink-0 border-r bg-muted/30 md:block">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
            R
          </span>
          <span className="font-semibold">Resto</span>
        </div>

        {/* Main nav */}
        <div className="flex-1 space-y-1 p-3">
          <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          {mainNav.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                (activeItem === item.label.toLowerCase() || item.active) &&
                  !showProjectNav
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
                Bella&apos;s Bistro
              </p>
              {projectNav.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    activeItem === item.label.toLowerCase()
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

        {/* Footer */}
        <div className="border-t p-3">
          <p className="text-center text-xs text-muted-foreground">
            ATR Platform v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
