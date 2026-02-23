import type { LucideIcon } from "lucide-react";

// ─── Phase definitions ──────────────────────────────────────────────

export type DemoPhaseKey =
  | "onboarding"
  | "dashboard"
  | "chat"
  | "voice"
  | "integrations"
  | "build"
  | "knowledge"
  | "analytics"
  | "channels"
  | "deploy";

export type DemoPhaseDefinition = {
  key: DemoPhaseKey;
  label: string;
  sidebarItem: string;
  showSidebar: boolean;
  showProjectNav: boolean;
};

// ─── Phase content types ────────────────────────────────────────────

export type OnboardingContent = {
  industries: { id: string; name: string; emoji: string }[];
  verticals: { id: string; name: string }[];
  features: { id: string; name: string }[];
  autoSelections: {
    industry: string;
    vertical: string;
    features: string[];
    autonomy: Record<string, string>;
  };
  projectName: string;
  projectDescription: string;
};

export type DashboardContent = {
  projectName: string;
  projectBadge: string;
  projectDescription: string;
};

export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  action?: {
    type: "approval";
    title: string;
    description: string;
  };
};

export type ChatContent = {
  script: ChatMessage[];
};

export type VoiceTranscriptLine = {
  speaker: "user" | "agent";
  text: string;
  durationMs: number;
};

export type VoiceContent = {
  transcript: VoiceTranscriptLine[];
  summary: string;
};

export type IntegrationItem = {
  name: string;
  icon: string;
  category: string;
  description: string;
};

export type IntegrationsContent = {
  integrations: IntegrationItem[];
};

export type FileTreeNode = {
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
};

export type BuildContent = {
  checklist: { title: string; stage: string; status: string }[];
  fileTree: FileTreeNode[];
};

export type KnowledgeDocument = {
  title: string;
  category: string;
  tier: "index" | "summary" | "detail";
  lines: number;
  crossRefs?: string[];
};

export type KnowledgeContent = {
  categories: { name: string; icon: string; count: number }[];
  documents: KnowledgeDocument[];
};

export type AgentCharacter = {
  name: string;
  role: string;
  avatar: string;
  color: string;
  tasks: string[];
  reportsTo?: string;
};

export type AnalyticsContent = {
  charts: {
    label: string;
    data: { name: string; value: number }[];
    type: "bar" | "line";
  }[];
  agents: AgentCharacter[];
  humanReviewPoints: { agent: string; task: string; reason: string }[];
};

export type ChannelItem = {
  name: string;
  icon: string;
  color: string;
  previewMessage: string;
};

export type ChannelsContent = {
  channels: ChannelItem[];
};

export type TerminalLine = {
  text: string;
  type: "command" | "output" | "success" | "info";
  delay: number;
};

export type DeployContent = {
  terminalLines: TerminalLine[];
  projectUrl: string;
  stats: { label: string; value: string }[];
};

// ─── Aggregate ──────────────────────────────────────────────────────

export type UseCaseDemoContent = {
  onboarding: OnboardingContent;
  dashboard: DashboardContent;
  chat: ChatContent;
  voice: VoiceContent;
  integrations: IntegrationsContent;
  build: BuildContent;
  knowledge: KnowledgeContent;
  analytics: AnalyticsContent;
  channels: ChannelsContent;
  deploy: DeployContent;
};
