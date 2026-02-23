import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "saas", name: "SaaS", emoji: "☁️" },
      { id: "fintech", name: "Fintech", emoji: "💳" },
      { id: "consulting", name: "Consulting", emoji: "📊" },
      { id: "manufacturing", name: "Manufacturing", emoji: "🏭" },
      { id: "agency", name: "Agency / Services", emoji: "🎯" },
      { id: "marketplace", name: "Marketplace", emoji: "🛒" },
    ],
    verticals: [
      { id: "sales-pipeline", name: "Sales Pipeline Management" },
      { id: "account-management", name: "Account Management" },
      { id: "lead-generation", name: "Lead Generation & Scoring" },
      { id: "customer-success", name: "Customer Success" },
    ],
    features: [
      { id: "lead-scoring", name: "AI Lead Scoring" },
      { id: "pipeline-automation", name: "Pipeline Automation" },
      { id: "email-sequences", name: "Email Sequences" },
      { id: "deal-forecasting", name: "Deal Forecasting" },
      { id: "territory-mapping", name: "Territory Mapping" },
      { id: "revenue-intelligence", name: "Revenue Intelligence" },
    ],
    autoSelections: {
      industry: "saas",
      vertical: "sales-pipeline",
      features: ["lead-scoring", "pipeline-automation", "email-sequences", "deal-forecasting"],
      autonomy: {
        "lead-scoring": "full",
        "pipeline-automation": "full",
        "email-sequences": "supervised",
        "deal-forecasting": "full",
        "territory-mapping": "full",
        "revenue-intelligence": "full",
      },
    },
    projectName: "PipelineIQ",
    projectDescription: "AI-powered CRM with predictive lead scoring, automated outreach sequences, and real-time deal forecasting for high-velocity sales teams.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "PipelineIQ",
    projectBadge: "CRM",
    projectDescription: "Close more deals faster — intelligent lead routing, automated follow-ups, and revenue forecasting that keeps your pipeline healthy and predictable.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Good morning. Pipeline snapshot: $2.4M in active deals across 47 opportunities. 6 deals worth $680K are at risk of slipping past quarter-end — I've flagged them in your priority queue. Your top deal, Acme Corp ($320K), hasn't had contact in 8 days.",
      },
      {
        role: "user",
        content: "What's happening with Acme Corp? Pull up the deal history.",
      },
      {
        role: "assistant",
        content: "Acme Corp — $320K ARR, Enterprise tier. Currently in Negotiation stage (day 12 of avg 15-day stage duration). Here's the timeline:\n\n• **Feb 5** — Demo completed, strong engagement from VP of Eng\n• **Feb 8** — Proposal sent, 3-year term with 15% volume discount\n• **Feb 12** — Brief email from Sarah Chen (champion) saying \"circulating internally\"\n• **No contact since Feb 12**\n\nSentiment analysis on recent emails suggests positive intent but possible internal budget review. Their fiscal year ends March 31, which aligns with urgency. I'd recommend a soft touch — maybe share a relevant case study from a similar company.",
      },
      {
        role: "user",
        content: "Draft a follow-up email for Sarah Chen. Keep it warm, share the Dataflow case study.",
      },
      {
        role: "assistant",
        content: "Here's a draft:\n\n**Subject:** Quick thought on your rollout plan\n\nHi Sarah,\n\nHope the internal review is going well. I wanted to share how Dataflow (similar team size, engineering-led org) achieved a 40% reduction in onboarding time after deploying — thought it might help frame the conversation with your team.\n\n[Case Study Link]\n\nHappy to jump on a quick call if any questions come up during the review. No rush at all.\n\nBest,\n[Your name]\n\nShall I send this from your connected Gmail, or would you like to tweak it first?",
        action: {
          type: "approval",
          title: "Send Follow-Up Email to Sarah Chen",
          description: "Send the drafted follow-up email to Sarah Chen (sarah.chen@acmecorp.io) via connected Gmail with the Dataflow case study attachment. Deal: Acme Corp, $320K ARR.",
        },
      },
      {
        role: "user",
        content: "Send it. What else needs my attention today?",
      },
      {
        role: "assistant",
        content: "Email sent and logged to the Acme Corp deal timeline. Here's your priority list for today:\n\n1. **NovaTech ($185K)** — Contract signature pending. DocuSign was sent Monday, no action yet. Recommend a quick check-in call.\n2. **3 new MQLs** scored above 85 — all from the webinar on Tuesday. Two are mid-market SaaS companies in your territory.\n3. **Quarterly forecast review** at 3 PM — current projection is $1.8M against $2.1M target. I've prepared a scenario analysis showing path to close the gap.\n4. **Renewal alert** — CloudBase Inc. ($95K) renewal is in 30 days. Usage data shows 72% adoption — slightly below healthy threshold. May need a CSM touchpoint.",
      },
      {
        role: "user",
        content: "Route the MQLs to Jordan and Alex based on territory. I'll handle NovaTech myself.",
      },
      {
        role: "assistant",
        content: "Done. MQL routing:\n• **Prism Analytics** (San Francisco) → Jordan — matches West Coast territory\n• **StackBridge** (Austin) → Alex — matches Central territory\n• **Cortex AI** (Boston) → Jordan — matches East Coast territory (Alex is at capacity)\n\nAll three have been assigned with full lead intelligence packets. Jordan and Alex will get Slack notifications with the lead details. I've also added NovaTech to your call block this morning and pulled up the DocuSign status for quick reference.",
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning. Here's your sales briefing for Thursday, February 20th.", durationMs: 3000 },
      { speaker: "agent", text: "Your pipeline stands at $2.4 million across 47 active opportunities. Six deals worth $680K are at risk of slipping past quarter-end. The biggest is Acme Corp at $320K — they've gone silent for 8 days. I recommend a warm follow-up with a case study.", durationMs: 9800 },
      { speaker: "agent", text: "Three new marketing-qualified leads scored above 85 from Tuesday's webinar. Two are mid-market SaaS companies in active buying cycles. They'll need routing to your reps today to maintain response-time SLA.", durationMs: 8200 },
      { speaker: "agent", text: "Looking ahead: quarterly forecast review is at 3 PM. You're tracking at $1.8M against a $2.1M target. I've modeled three scenarios showing how the gap can be closed with the current pipeline. Also, CloudBase renewal is in 30 days with below-average adoption — flagging for customer success intervention.", durationMs: 11500 },
    ],
    summary: "Sales briefing covered $2.4M pipeline status, 6 at-risk deals, 3 high-scoring MQLs needing routing, quarterly forecast gap analysis, and an upcoming renewal risk.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Salesforce", icon: "cloud", category: "CRM", description: "Bi-directional sync for contacts, deals, and activity tracking" },
      { name: "LinkedIn Sales Nav", icon: "linkedin", category: "Prospecting", description: "Lead intelligence, InMail automation, and relationship mapping" },
      { name: "Gong", icon: "mic", category: "Revenue Intel", description: "Call recording, conversation analytics, and deal risk scoring" },
      { name: "DocuSign", icon: "pen-tool", category: "Contracts", description: "Electronic signature workflows and contract lifecycle management" },
      { name: "Clearbit", icon: "database", category: "Enrichment", description: "Company and contact data enrichment for lead scoring" },
      { name: "Outreach", icon: "send", category: "Engagement", description: "Multi-channel sales sequences and engagement tracking" },
      COMMON_INTEGRATIONS.hubspot,
      COMMON_INTEGRATIONS.googleEmail,
      COMMON_INTEGRATIONS.calendar,
      COMMON_INTEGRATIONS.slack,
      COMMON_INTEGRATIONS.stripe,
      COMMON_INTEGRATIONS.analytics,
      COMMON_INTEGRATIONS.github,
      COMMON_INTEGRATIONS.vercel,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: "Design deal pipeline schema with custom stage configuration", stage: "plan", status: "complete" },
      { title: "Define lead scoring model with behavioral and firmographic signals", stage: "plan", status: "complete" },
      { title: "Build pipeline kanban board with drag-and-drop stage management", stage: "build", status: "complete" },
      { title: "Implement AI lead scoring engine with Clearbit enrichment", stage: "build", status: "complete" },
      { title: "Create email sequence builder with A/B testing support", stage: "build", status: "active" },
      { title: "Build revenue forecasting dashboard with scenario modeling", stage: "build", status: "pending" },
      { title: "Integrate Salesforce bi-directional sync", stage: "launch", status: "pending" },
      { title: "Deploy with SSO configuration and sales team onboarding", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "pipeline", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "deals", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[dealId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "contacts", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "leads", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "forecast", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "sequences", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "deals", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "contacts", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "leads", type: "folder", children: [
                { name: "route.ts", type: "file" },
                { name: "score", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "sequences", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "salesforce", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "email-events", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "lead-scorer.ts", type: "file" },
          { name: "forecast-engine.ts", type: "file" },
          { name: "salesforce-sync.ts", type: "file" },
          { name: "sequence-runner.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Sales Playbooks", icon: "target", count: 18 },
      { name: "Product Knowledge", icon: "package", count: 35 },
      { name: "Competitive Intel", icon: "swords", count: 22 },
      { name: "Case Studies", icon: "trophy", count: 28 },
      { name: "Pricing & Packaging", icon: "credit-card", count: 12 },
    ],
    documents: [
      { title: "Enterprise Sales Playbook", category: "Sales Playbooks", tier: "index", lines: 110, crossRefs: ["Objection Handling Guide", "ROI Calculator Framework"] },
      { title: "Objection Handling Guide", category: "Sales Playbooks", tier: "detail", lines: 340 },
      { title: "ROI Calculator Framework", category: "Sales Playbooks", tier: "detail", lines: 185 },
      { title: "Competitive Landscape Q1 2026", category: "Competitive Intel", tier: "summary", lines: 220, crossRefs: ["Feature Comparison Matrix"] },
      { title: "Feature Comparison Matrix", category: "Competitive Intel", tier: "detail", lines: 450 },
      { title: "Dataflow Case Study", category: "Case Studies", tier: "summary", lines: 95, crossRefs: ["Enterprise Sales Playbook"] },
      { title: "Mid-Market Pricing Guide", category: "Pricing & Packaging", tier: "detail", lines: 160 },
      { title: "Product Feature Deep-Dive: AI Lead Scoring", category: "Product Knowledge", tier: "detail", lines: 280, crossRefs: ["ROI Calculator Framework"] },
      { title: "Discovery Call Framework", category: "Sales Playbooks", tier: "summary", lines: 125 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Monthly Closed Revenue ($K)",
        type: "bar",
        data: [
          { name: "Sep", value: 380 },
          { name: "Oct", value: 420 },
          { name: "Nov", value: 510 },
          { name: "Dec", value: 680 },
          { name: "Jan", value: 445 },
          { name: "Feb", value: 390 },
        ],
      },
      {
        label: "Lead-to-Close Conversion Rate (%)",
        type: "line",
        data: [
          { name: "Sep", value: 12 },
          { name: "Oct", value: 14 },
          { name: "Nov", value: 15 },
          { name: "Dec", value: 18 },
          { name: "Jan", value: 16 },
          { name: "Feb", value: 17 },
        ],
      },
    ],
    agents: [
      { name: "Revenue Strategist", role: "Orchestrates sales operations and pipeline health", avatar: "💼", color: "blue", tasks: ["Pipeline health monitoring", "Quota tracking", "Territory balancing"] },
      { name: "Lead Intelligence", role: "Scores, enriches, and routes inbound leads", avatar: "🎯", color: "emerald", tasks: ["Lead scoring", "Data enrichment", "Smart routing"], reportsTo: "Revenue Strategist" },
      { name: "Outreach Agent", role: "Manages email sequences and multi-touch campaigns", avatar: "📧", color: "violet", tasks: ["Sequence execution", "A/B testing", "Reply detection"], reportsTo: "Revenue Strategist" },
      { name: "Deal Analyst", role: "Monitors deal health and predicts close probability", avatar: "📊", color: "amber", tasks: ["Deal scoring", "Risk flagging", "Stage progression analysis"], reportsTo: "Revenue Strategist" },
      { name: "Forecast Engine", role: "Generates revenue forecasts with scenario modeling", avatar: "📈", color: "rose", tasks: ["Weighted pipeline analysis", "Scenario modeling", "Quota attainment projection"], reportsTo: "Revenue Strategist" },
      { name: "Competitive Intel", role: "Tracks competitor movements and prepares battle cards", avatar: "⚔️", color: "cyan", tasks: ["Competitor monitoring", "Battle card updates", "Win/loss analysis"], reportsTo: "Deal Analyst" },
      { name: "Contract Agent", role: "Manages proposals, contracts, and signature workflows", avatar: "📝", color: "green", tasks: ["Proposal generation", "DocuSign tracking", "Renewal management"], reportsTo: "Deal Analyst" },
      { name: "CRM Sync Agent", role: "Maintains data integrity across connected systems", avatar: "🔄", color: "slate", tasks: ["Salesforce sync", "Duplicate detection", "Activity logging"], reportsTo: "Revenue Strategist" },
    ],
    humanReviewPoints: [
      { agent: "Outreach Agent", task: "Enterprise cold outreach approval", reason: "Outbound emails to C-suite contacts at strategic accounts require sales leader review before sending" },
      { agent: "Contract Agent", task: "Non-standard discount approval", reason: "Discounts exceeding 20% or custom payment terms require VP of Sales sign-off" },
      { agent: "Deal Analyst", task: "Deal stage regression", reason: "Moving a deal backward in the pipeline requires rep justification and manager acknowledgment" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Full CRM dashboard — pipeline, deals, forecasts, and lead management" :
        ch.name === "WhatsApp" ? "\"Acme Corp just opened your proposal. Sarah Chen viewed it for 4 minutes.\"" :
        ch.name === "Telegram" ? "Quick deal updates and lead alerts on the go" :
        ch.name === "Discord" ? "Sales team war room — deal strategy and competitive intel sharing" :
        ch.name === "Slack" ? "Use /pipeline, /deals, or /forecast for instant CRM data in any channel" :
        ch.name === "Email" ? "Daily pipeline digest, deal alerts, and weekly forecast summaries" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("pipelineiq", "https://pipelineiq.vercel.app"),
    projectUrl: "https://pipelineiq.vercel.app",
    stats: [
      { label: "Pipeline Value", value: "$2.4M" },
      { label: "Lead Response Time", value: "<5 min" },
      { label: "Conversion Lift", value: "+34%" },
      { label: "Forecast Accuracy", value: "91%" },
    ],
  },
};

export default content;
