import type { DemoPhaseDefinition } from "./types";

export const DEMO_PHASES: DemoPhaseDefinition[] = [
  { key: "onboarding", label: "Setup", sidebarItem: "projects", showSidebar: false, showProjectNav: false },
  { key: "dashboard", label: "Dashboard", sidebarItem: "projects", showSidebar: true, showProjectNav: false },
  { key: "integrations", label: "Integrations", sidebarItem: "integrations", showSidebar: true, showProjectNav: true },
  { key: "chat", label: "Chat", sidebarItem: "chat", showSidebar: true, showProjectNav: true },
  { key: "voice", label: "Voice", sidebarItem: "chat", showSidebar: true, showProjectNav: true },
  { key: "build", label: "Build", sidebarItem: "checklist", showSidebar: true, showProjectNav: true },
  { key: "knowledge", label: "Knowledge", sidebarItem: "knowledge base", showSidebar: true, showProjectNav: true },
  { key: "analytics", label: "Analytics", sidebarItem: "analytics", showSidebar: true, showProjectNav: false },
  { key: "deploy", label: "Deploy", sidebarItem: "projects", showSidebar: false, showProjectNav: false },
  { key: "operations", label: "Day 2+", sidebarItem: "projects", showSidebar: false, showProjectNav: false },
];
