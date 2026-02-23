import type { IntegrationItem, ChannelItem, TerminalLine } from "../types";

// ─── Common integrations reused across use cases ────────────────────

export const COMMON_INTEGRATIONS: Record<string, IntegrationItem> = {
  github: { name: "GitHub", icon: "github", category: "DevOps", description: "Repository, CI/CD, and code management" },
  vercel: { name: "Vercel", icon: "globe", category: "DevOps", description: "Deployment, hosting, and edge functions" },
  stripe: { name: "Stripe", icon: "credit-card", category: "Payments", description: "Payment processing, subscriptions, and invoicing" },
  domain: { name: "Domain Registry", icon: "globe-2", category: "Infrastructure", description: "Custom domain purchase and DNS configuration" },
  googleEmail: { name: "Google Workspace", icon: "mail", category: "Communication", description: "Gmail, Calendar, Drive, and Meet integration" },
  outlook: { name: "Microsoft 365", icon: "mail", category: "Communication", description: "Outlook, Teams, Calendar, and OneDrive" },
  calendar: { name: "Google Calendar", icon: "calendar", category: "Scheduling", description: "Event scheduling, reminders, and availability" },
  geminiResearch: { name: "Gemini Deep Research", icon: "search", category: "AI", description: "Market research, competitor analysis, and trend reports" },
  imageGen: { name: "Image Generation", icon: "image", category: "AI", description: "AI-powered image creation for marketing and content" },
  videoGen: { name: "Video Generation", icon: "video", category: "AI", description: "Automated video creation for social media and ads" },
  claude: { name: "Claude AI", icon: "brain", category: "AI", description: "Advanced reasoning, writing, and code generation" },
  slack: { name: "Slack", icon: "hash", category: "Communication", description: "Team messaging, channels, and workflow automations" },
  notion: { name: "Notion", icon: "file-text", category: "Productivity", description: "Documentation, wikis, and project databases" },
  hubspot: { name: "HubSpot", icon: "users", category: "CRM", description: "Contact management, marketing, and sales automation" },
  analytics: { name: "Google Analytics", icon: "bar-chart-2", category: "Analytics", description: "Website traffic, user behavior, and conversion tracking" },
  sentry: { name: "Sentry", icon: "shield", category: "DevOps", description: "Error monitoring, performance tracking, and alerting" },
  twilio: { name: "Twilio", icon: "phone", category: "Communication", description: "SMS, voice calls, and WhatsApp messaging" },
  posthog: { name: "PostHog", icon: "activity", category: "Analytics", description: "Product analytics, session replay, and feature flags" },
};

// ─── Common channels ────────────────────────────────────────────────

export const COMMON_CHANNELS: ChannelItem[] = [
  { name: "Web Portal", icon: "globe", color: "emerald", previewMessage: "Access your full dashboard, analytics, and agent controls" },
  { name: "WhatsApp", icon: "message-circle", color: "green", previewMessage: "Send a message anytime to check status or give instructions" },
  { name: "Telegram", icon: "send", color: "blue", previewMessage: "Quick commands and status updates on the go" },
  { name: "Discord", icon: "hash", color: "indigo", previewMessage: "Team collaboration with dedicated project channels" },
  { name: "Slack", icon: "hash", color: "purple", previewMessage: "Integrated into your team workspace with slash commands" },
  { name: "Email", icon: "mail", color: "rose", previewMessage: "Daily digests, alerts, and async communication" },
];

// ─── Deploy terminal generator ──────────────────────────────────────

export function makeDeployTerminal(projectSlug: string, projectUrl: string): TerminalLine[] {
  return [
    { text: "$ git init && git add .", type: "command", delay: 0 },
    { text: "Initialized empty Git repository", type: "output", delay: 800 },
    { text: `$ git commit -m "feat: initial ${projectSlug} scaffold"`, type: "command", delay: 1200 },
    { text: "[main (root-commit) a3f7c21] feat: initial scaffold\n 52 files changed, 4,218 insertions(+)", type: "output", delay: 2000 },
    { text: `$ git remote add origin github.com/${projectSlug}/app`, type: "command", delay: 3000 },
    { text: "$ git push -u origin main", type: "command", delay: 3800 },
    { text: "Enumerating objects: 94, done.\nTo github.com:" + projectSlug + "/app.git\n * [new branch]    main -> main", type: "output", delay: 4800 },
    { text: "\u2713 Pushed to GitHub", type: "success", delay: 6000 },
    { text: "$ vercel --prod", type: "command", delay: 7000 },
    { text: "Vercel CLI 48.10.4\nInspecting project settings...\nBuilding project...", type: "output", delay: 8000 },
    { text: "Route (app)                Size\n\u250c \u25cb /                      5.4 kB\n\u251c \u25cb /dashboard             7.2 kB\n\u251c \u0192 /api/[...route]        2.1 kB\n\u2514 \u0192 /api/webhooks          0.8 kB", type: "info", delay: 10000 },
    { text: "\u2713 Production deployment complete!", type: "success", delay: 12000 },
    { text: `\u2713 ${projectUrl} \u2192 Ready`, type: "success", delay: 13000 },
  ];
}
