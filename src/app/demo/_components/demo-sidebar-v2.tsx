"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/demo/i18n/context";
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

type NavItem = { tKey: string; key: string; icon: LucideIcon };

const mainNav: NavItem[] = [
  { tKey: "sidebar.projects", key: "projects", icon: FolderKanban },
  { tKey: "sidebar.analytics", key: "analytics", icon: BarChart2 },
  { tKey: "sidebar.billing", key: "billing", icon: CreditCard },
  { tKey: "sidebar.settings", key: "settings", icon: Settings },
];

const projectNav: NavItem[] = [
  { tKey: "sidebar.chat", key: "chat", icon: MessageSquare },
  { tKey: "sidebar.checklist", key: "checklist", icon: CheckSquare },
  { tKey: "sidebar.knowledgeBase", key: "knowledge base", icon: BookOpen },
  { tKey: "sidebar.integrations", key: "integrations", icon: Plug },
  { tKey: "sidebar.agents", key: "agents", icon: Users },
];

type Props = {
  activeItem?: string;
  showProjectNav?: boolean;
  projectName: string;
};

export function DemoSidebarV2({ activeItem, showProjectNav = false, projectName }: Props) {
  const { t } = useI18n();

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
            {t("sidebar.navigation")}
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
              {t(item.tKey as Parameters<typeof t>[0])}
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
                  {t(item.tKey as Parameters<typeof t>[0])}
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
