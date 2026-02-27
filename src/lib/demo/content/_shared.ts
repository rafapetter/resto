import type { IntegrationItem, ChannelItem, TerminalLine, OperationsContent } from "../types";
import type { Locale } from "../i18n/types";

/** Pick string by locale */
export function l(locale: Locale, en: string, pt: string): string {
  return locale === "pt" ? pt : en;
}

// ─── Common integrations reused across use cases ────────────────────

export function getCommonIntegrations(locale: Locale): Record<string, IntegrationItem> {
  return {
    github: { name: "GitHub", icon: "github", category: "DevOps", description: l(locale, "Repository, CI/CD, and code management", "Repositório, CI/CD e gerenciamento de código") },
    vercel: { name: "Vercel", icon: "globe", category: "DevOps", description: l(locale, "Deployment, hosting, and edge functions", "Deploy, hospedagem e funções edge") },
    stripe: { name: "Stripe", icon: "credit-card", category: l(locale, "Payments", "Pagamentos"), description: l(locale, "Payment processing, subscriptions, and invoicing", "Processamento de pagamentos, assinaturas e faturamento") },
    domain: { name: "Domain Registry", icon: "globe-2", category: l(locale, "Infrastructure", "Infraestrutura"), description: l(locale, "Custom domain purchase and DNS configuration", "Compra de domínio e configuração DNS") },
    googleEmail: { name: "Google Workspace", icon: "mail", category: l(locale, "Communication", "Comunicação"), description: l(locale, "Gmail, Calendar, Drive, and Meet integration", "Integração Gmail, Calendar, Drive e Meet") },
    outlook: { name: "Microsoft 365", icon: "mail", category: l(locale, "Communication", "Comunicação"), description: l(locale, "Outlook, Teams, Calendar, and OneDrive", "Outlook, Teams, Calendar e OneDrive") },
    calendar: { name: "Google Calendar", icon: "calendar", category: l(locale, "Scheduling", "Agendamento"), description: l(locale, "Event scheduling, reminders, and availability", "Agendamento de eventos, lembretes e disponibilidade") },
    geminiResearch: { name: "Gemini Deep Research", icon: "search", category: "AI", description: l(locale, "Market research, competitor analysis, and trend reports", "Pesquisa de mercado, análise de concorrentes e relatórios de tendências") },
    imageGen: { name: "Image Generation", icon: "image", category: "AI", description: l(locale, "AI-powered image creation for marketing and content", "Criação de imagens por IA para marketing e conteúdo") },
    videoGen: { name: "Video Generation", icon: "video", category: "AI", description: l(locale, "Automated video creation for social media and ads", "Criação automatizada de vídeos para redes sociais e anúncios") },
    claude: { name: "Claude AI", icon: "brain", category: "AI", description: l(locale, "Advanced reasoning, writing, and code generation", "Raciocínio avançado, escrita e geração de código") },
    slack: { name: "Slack", icon: "hash", category: l(locale, "Communication", "Comunicação"), description: l(locale, "Team messaging, channels, and workflow automations", "Mensagens de equipe, canais e automações de fluxo") },
    notion: { name: "Notion", icon: "file-text", category: l(locale, "Productivity", "Produtividade"), description: l(locale, "Documentation, wikis, and project databases", "Documentação, wikis e bancos de dados de projetos") },
    hubspot: { name: "HubSpot", icon: "users", category: "CRM", description: l(locale, "Contact management, marketing, and sales automation", "Gestão de contatos, marketing e automação de vendas") },
    analytics: { name: "Google Analytics", icon: "bar-chart-2", category: "Analytics", description: l(locale, "Website traffic, user behavior, and conversion tracking", "Tráfego do site, comportamento do usuário e rastreamento de conversões") },
    sentry: { name: "Sentry", icon: "shield", category: "DevOps", description: l(locale, "Error monitoring, performance tracking, and alerting", "Monitoramento de erros, performance e alertas") },
    twilio: { name: "Twilio", icon: "phone", category: l(locale, "Communication", "Comunicação"), description: l(locale, "SMS, voice calls, and WhatsApp messaging", "SMS, chamadas de voz e mensagens WhatsApp") },
    posthog: { name: "PostHog", icon: "activity", category: "Analytics", description: l(locale, "Product analytics, session replay, and feature flags", "Analytics de produto, replay de sessão e feature flags") },
  };
}

// ─── Common channels ────────────────────────────────────────────────

export function getCommonChannels(locale: Locale): ChannelItem[] {
  return [
    { name: "Web Portal", icon: "globe", color: "emerald", previewMessage: l(locale, "Access your full dashboard, analytics, and agent controls", "Acesse seu painel completo, analytics e controles de agentes") },
    { name: "WhatsApp", icon: "message-circle", color: "green", previewMessage: l(locale, "Send a message anytime to check status or give instructions", "Envie uma mensagem a qualquer momento para verificar status ou dar instruções") },
    { name: "Telegram", icon: "send", color: "blue", previewMessage: l(locale, "Quick commands and status updates on the go", "Comandos rápidos e atualizações de status em movimento") },
    { name: "Discord", icon: "hash", color: "indigo", previewMessage: l(locale, "Team collaboration with dedicated project channels", "Colaboração de equipe com canais dedicados por projeto") },
    { name: "Slack", icon: "hash", color: "purple", previewMessage: l(locale, "Integrated into your team workspace with slash commands", "Integrado ao workspace da equipe com comandos slash") },
    { name: "Email", icon: "mail", color: "rose", previewMessage: l(locale, "Daily digests, alerts, and async communication", "Resumos diários, alertas e comunicação assíncrona") },
  ];
}

// ─── Default operations content ─────────────────────────────────────

export function getDefaultOperations(locale: Locale): OperationsContent {
  return {
    events: [
      { day: 2, label: l(locale, "SEO optimization complete — meta tags, sitemap, and structured data generated", "Otimização SEO completa — meta tags, sitemap e dados estruturados gerados"), type: "gtm" },
      { day: 5, label: l(locale, "First users onboarded — automated welcome sequences triggered", "Primeiros usuários integrados — sequências de boas-vindas automáticas ativadas"), type: "growth" },
      { day: 7, label: l(locale, "Uptime monitor: 100% availability, avg response time 145ms", "Monitor de uptime: 100% disponibilidade, tempo de resposta médio 145ms"), type: "monitor" },
      { day: 14, label: l(locale, "Marketing campaign launched — email sequences and social posts scheduled", "Campanha de marketing lançada — sequências de e-mail e posts sociais agendados"), type: "gtm" },
      { day: 21, label: l(locale, "Minor bug detected in form validation — patch deployed in 3 minutes", "Bug menor detectado na validação do formulário — patch implantado em 3 minutos"), type: "fix" },
      { day: 30, label: l(locale, "Monthly report: all KPIs trending up, zero downtime incidents", "Relatório mensal: todos os KPIs em alta, zero incidentes de indisponibilidade"), type: "monitor" },
      { day: 45, label: l(locale, "Feature iteration: user feedback analyzed, 3 UX improvements deployed", "Iteração de features: feedback analisado, 3 melhorias de UX implantadas"), type: "iterate" },
      { day: 60, label: l(locale, "Growth milestone: 500+ active users, retention rate at 78%", "Marco de crescimento: 500+ usuários ativos, taxa de retenção em 78%"), type: "growth" },
      { day: 90, label: l(locale, "Q1 review: platform stable, 99.99% uptime, continuous improvement active", "Revisão Q1: plataforma estável, 99.99% uptime, melhoria contínua ativa"), type: "growth" },
    ],
    finalMetrics: [
      { label: "Uptime", value: "99.99%" },
      { label: l(locale, "Active Users", "Usuários Ativos"), value: "500+" },
      { label: l(locale, "Bugs Fixed", "Bugs Corrigidos"), value: "12" },
      { label: "Time to Market", value: "12 min" },
    ],
  };
}

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
