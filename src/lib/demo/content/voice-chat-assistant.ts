import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "customer-service", name: "Customer Service", emoji: "🎧" },
      { id: "hospitality", name: "Hospitality", emoji: "🏨" },
      { id: "telecom", name: "Telecom", emoji: "📡" },
      { id: "banking", name: "Banking", emoji: "🏦" },
      { id: "utilities", name: "Utilities", emoji: "⚡" },
      { id: "government", name: "Government Services", emoji: "🏛️" },
    ],
    verticals: [
      { id: "inbound-support", name: "Inbound Support" },
      { id: "outbound-campaigns", name: "Outbound Campaigns" },
      { id: "virtual-receptionist", name: "Virtual Receptionist" },
      { id: "ivr-replacement", name: "IVR Replacement" },
    ],
    features: [
      { id: "voice-recognition", name: "Voice Recognition & NLU" },
      { id: "sentiment-analysis", name: "Real-Time Sentiment Analysis" },
      { id: "agent-handoff", name: "Smart Agent Handoff" },
      { id: "call-summarization", name: "Call Summarization" },
      { id: "multilingual", name: "Multilingual Support" },
      { id: "voice-cloning", name: "Custom Voice Cloning" },
    ],
    autoSelections: {
      industry: "customer-service",
      vertical: "inbound-support",
      features: ["voice-recognition", "sentiment-analysis", "agent-handoff", "call-summarization"],
      autonomy: {
        "voice-recognition": "full",
        "sentiment-analysis": "full",
        "agent-handoff": "supervised",
        "call-summarization": "full",
        "multilingual": "full",
        "voice-cloning": "supervised",
      },
    },
    projectName: "AssistPro",
    projectDescription: "Enterprise voice and chat AI assistant with natural language understanding, real-time sentiment analysis, and seamless human handoff for omnichannel support.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "AssistPro",
    projectBadge: "Voice & Chat",
    projectDescription: "Replace legacy IVR with conversational AI — handle 80% of support calls autonomously while routing complex issues to the right human agent with full context.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Good morning. AssistPro handled 1,247 conversations yesterday — 982 voice calls and 265 chat sessions. Resolution rate: 78% without human escalation. Average handle time dropped to 3.2 minutes, down from 4.8 minutes last month. Sentiment scores averaged 4.1/5.",
      },
      {
        role: "user",
        content: "What were the top reasons for human escalation yesterday?",
      },
      {
        role: "assistant",
        content: "Top escalation reasons (271 total handoffs):\n\n1. **Billing disputes** — 82 calls (30.3%). Customers disputing charges beyond the $50 auto-resolution threshold.\n2. **Account cancellation requests** — 54 calls (19.9%). Retention flow triggered but customer insisted on speaking with a person.\n3. **Technical troubleshooting (Tier 2)** — 48 calls (17.7%). Issues requiring access to internal diagnostic tools.\n4. **Emotional distress detected** — 41 calls (15.1%). Sentiment analysis flagged high frustration — policy requires human empathy.\n5. **Regulatory/compliance queries** — 46 calls (17.0%). Legal-adjacent questions routed per compliance rules.\n\nI've noticed billing disputes are trending up 12% week-over-week. The recent price increase may be driving this. Should I adjust the auto-resolution threshold or add a proactive price-change acknowledgment to the call flow?",
      },
      {
        role: "user",
        content: "Add the proactive acknowledgment. Also, can we improve the retention flow for cancellations?",
      },
      {
        role: "assistant",
        content: "I've drafted two changes:\n\n**1. Proactive Price Acknowledgment** — When a caller mentions \"bill\" or \"charges,\" the AI will proactively say: \"I see your plan recently changed. Let me walk you through the adjustment and any options available.\" This should deflect ~30% of billing escalations.\n\n**2. Enhanced Retention Flow** — Adding three new retention offers:\n• Loyalty discount (15% for 3 months) for customers with 12+ months tenure\n• Plan downgrade option with feature comparison\n• Pause subscription for up to 60 days\n\nThe retention offers would be presented conversationally before the cancellation handoff. Want me to activate these in the staging environment for A/B testing?",
        action: {
          type: "approval",
          title: "Deploy Updated Call Flows to Staging",
          description: "Push the proactive billing acknowledgment script and enhanced retention flow (3 new offers) to the staging environment for A/B testing. Test group: 20% of inbound calls for 7 days. Success metrics: escalation rate reduction and retention save rate.",
        },
      },
      {
        role: "user",
        content: "Deploy to staging. What's the voice quality looking like?",
      },
      {
        role: "assistant",
        content: "Deployed to staging. Voice quality metrics for the past 7 days:\n\n• **Speech recognition accuracy**: 96.8% (up from 95.2% after the February model update)\n• **Intent classification**: 94.1% first-try accuracy\n• **Average latency**: 320ms response time (target: <500ms)\n• **Voice naturalness rating**: 4.3/5 from post-call surveys\n• **Language coverage**: English (98.2%), Spanish (94.5%), French (91.8%), Mandarin (89.4%)\n\nOne thing to flag: Mandarin accuracy dropped 2% this week. Root cause appears to be a new batch of calls from Cantonese speakers being misclassified. I recommend adding a Cantonese language model to the recognition pipeline.",
      },
      {
        role: "user",
        content: "Add Cantonese support to the roadmap. Anything else I should know?",
      },
      {
        role: "assistant",
        content: "Cantonese support added to the Q2 roadmap. A few more items:\n\n1. **Peak hour alert**: Call volume spikes 40% between 10-11 AM. I've pre-scaled the voice infrastructure to handle the load, but we're approaching the 200 concurrent call limit on the current plan.\n2. **New integration request**: The support team asked for Zendesk ticket creation directly from call summaries. I can wire that up — it would auto-create tickets with full call transcript and sentiment tags.\n3. **Monthly report**: February's containment rate is on track to hit 80%, which would be a new high. Cost per interaction is down to $0.42 vs. $3.80 for human-handled calls.\n\nThe ROI story is strong — shall I generate a stakeholder report for the quarterly review?",
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning. Here's your AssistPro operations briefing for February 20th.", durationMs: 3000 },
      { speaker: "agent", text: "Yesterday we handled 1,247 conversations — 982 voice and 265 chat. Resolution without escalation was 78%, and average handle time dropped to 3.2 minutes. Customer sentiment averaged 4.1 out of 5.", durationMs: 9200 },
      { speaker: "agent", text: "Top escalation driver is billing disputes at 30% of handoffs, trending up 12% week over week likely due to the recent price change. I've prepared a proactive acknowledgment script and enhanced retention flow for your review.", durationMs: 8800 },
      { speaker: "agent", text: "Voice quality is strong at 96.8% recognition accuracy with 320 millisecond response latency. One flag: Mandarin accuracy dropped due to Cantonese misclassification. I recommend adding Cantonese as a supported language. Monthly containment rate is tracking toward 80%, a new record.", durationMs: 10500 },
    ],
    summary: "Briefing covered 1,247 daily conversations, 78% autonomous resolution, billing escalation trend, proactive script updates, voice quality metrics, and record-setting containment rate.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Twilio Voice", icon: "phone", category: "Telephony", description: "Programmable voice calls with SIP trunking and call recording" },
      { name: "Deepgram", icon: "mic", category: "Speech AI", description: "Real-time speech-to-text with speaker diarization and noise cancellation" },
      { name: "ElevenLabs", icon: "audio-waveform", category: "Voice Synthesis", description: "Custom voice cloning and text-to-speech with natural prosody" },
      { name: "Zendesk", icon: "headphones", category: "Helpdesk", description: "Ticket creation, agent routing, and support workflow management" },
      { name: "Intercom", icon: "message-square", category: "Chat", description: "Live chat widget, chatbot flows, and customer messaging platform" },
      { name: "Five9", icon: "phone-call", category: "Contact Center", description: "Cloud contact center with ACD, workforce management, and reporting" },
      COMMON_INTEGRATIONS.twilio,
      COMMON_INTEGRATIONS.slack,
      COMMON_INTEGRATIONS.claude,
      COMMON_INTEGRATIONS.googleEmail,
      COMMON_INTEGRATIONS.analytics,
      COMMON_INTEGRATIONS.posthog,
      COMMON_INTEGRATIONS.github,
      COMMON_INTEGRATIONS.vercel,
      COMMON_INTEGRATIONS.sentry,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: "Design conversation state machine and intent taxonomy", stage: "plan", status: "complete" },
      { title: "Define escalation rules, sentiment thresholds, and handoff logic", stage: "plan", status: "complete" },
      { title: "Build voice pipeline: STT → NLU → Dialog → TTS", stage: "build", status: "complete" },
      { title: "Implement real-time sentiment analysis with escalation triggers", stage: "build", status: "complete" },
      { title: "Create agent handoff system with context transfer", stage: "build", status: "active" },
      { title: "Build call analytics dashboard with recording playback", stage: "build", status: "pending" },
      { title: "Set up multi-language model routing", stage: "launch", status: "pending" },
      { title: "Deploy with auto-scaling and telephony redundancy", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "conversations", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[conversationId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "call-flows", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "analytics", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "agents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "settings", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "voice", type: "folder", children: [
                { name: "inbound", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "outbound", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "chat", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "sentiment", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "transcribe", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "twilio", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "zendesk", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "dialog-engine.ts", type: "file" },
          { name: "sentiment-analyzer.ts", type: "file" },
          { name: "voice-pipeline.ts", type: "file" },
          { name: "handoff-router.ts", type: "file" },
          { name: "call-summarizer.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Call Flow Scripts", icon: "phone", count: 36 },
      { name: "Intent Libraries", icon: "brain", count: 28 },
      { name: "Escalation Policies", icon: "alert-circle", count: 14 },
      { name: "Product Knowledge Base", icon: "book-open", count: 52 },
    ],
    documents: [
      { title: "Master Intent Taxonomy", category: "Intent Libraries", tier: "index", lines: 140, crossRefs: ["Billing Intent Flows", "Technical Support Decision Tree"] },
      { title: "Billing Intent Flows", category: "Call Flow Scripts", tier: "detail", lines: 380 },
      { title: "Technical Support Decision Tree", category: "Call Flow Scripts", tier: "detail", lines: 450 },
      { title: "Escalation Policy Framework", category: "Escalation Policies", tier: "summary", lines: 165, crossRefs: ["Sentiment Threshold Configuration"] },
      { title: "Sentiment Threshold Configuration", category: "Escalation Policies", tier: "detail", lines: 120 },
      { title: "Retention Offer Matrix", category: "Call Flow Scripts", tier: "summary", lines: 95, crossRefs: ["Master Intent Taxonomy"] },
      { title: "Multilingual Response Templates", category: "Product Knowledge Base", tier: "detail", lines: 680 },
      { title: "Voice Quality Standards & SLAs", category: "Escalation Policies", tier: "summary", lines: 110 },
      { title: "FAQ Knowledge Base — Tier 1", category: "Product Knowledge Base", tier: "index", lines: 220, crossRefs: ["Technical Support Decision Tree"] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Daily Conversations Handled",
        type: "bar",
        data: [
          { name: "Mon", value: 1180 },
          { name: "Tue", value: 1320 },
          { name: "Wed", value: 1290 },
          { name: "Thu", value: 1247 },
          { name: "Fri", value: 1150 },
          { name: "Sat", value: 680 },
          { name: "Sun", value: 420 },
        ],
      },
      {
        label: "Autonomous Resolution Rate (%)",
        type: "line",
        data: [
          { name: "Sep", value: 62 },
          { name: "Oct", value: 67 },
          { name: "Nov", value: 71 },
          { name: "Dec", value: 74 },
          { name: "Jan", value: 76 },
          { name: "Feb", value: 78 },
        ],
      },
    ],
    agents: [
      { name: "Conversation Orchestrator", role: "Routes and manages all inbound voice and chat conversations", avatar: "🎧", color: "blue", tasks: ["Channel routing", "Load balancing", "Priority queuing"] },
      { name: "Voice Agent", role: "Handles voice calls with STT, NLU, and TTS pipeline", avatar: "🗣️", color: "emerald", tasks: ["Speech recognition", "Intent classification", "Voice response generation"], reportsTo: "Conversation Orchestrator" },
      { name: "Chat Agent", role: "Manages text-based conversations across web and messaging", avatar: "💬", color: "violet", tasks: ["Message processing", "Quick reply suggestions", "Rich media responses"], reportsTo: "Conversation Orchestrator" },
      { name: "Sentiment Monitor", role: "Analyzes customer emotion in real-time", avatar: "😊", color: "amber", tasks: ["Emotion detection", "Frustration alerts", "Satisfaction scoring"], reportsTo: "Conversation Orchestrator" },
      { name: "Handoff Manager", role: "Transfers conversations to human agents with full context", avatar: "🤝", color: "rose", tasks: ["Agent matching", "Context packaging", "Warm transfer execution"], reportsTo: "Conversation Orchestrator" },
      { name: "Knowledge Retriever", role: "Finds relevant answers from the knowledge base", avatar: "📚", color: "cyan", tasks: ["Semantic search", "Answer extraction", "Source citation"], reportsTo: "Voice Agent" },
      { name: "Quality Analyst", role: "Scores conversations and identifies coaching opportunities", avatar: "⭐", color: "green", tasks: ["Call scoring", "Compliance checking", "Improvement recommendations"], reportsTo: "Conversation Orchestrator" },
      { name: "Language Router", role: "Detects language and routes to appropriate model", avatar: "🌐", color: "slate", tasks: ["Language detection", "Model selection", "Translation fallback"], reportsTo: "Voice Agent" },
    ],
    humanReviewPoints: [
      { agent: "Handoff Manager", task: "VIP customer escalation", reason: "High-value accounts flagged for dedicated support require manager-level agent assignment" },
      { agent: "Voice Agent", task: "Legal or compliance-related inquiry", reason: "Regulatory questions must be routed to trained compliance agents per company policy" },
      { agent: "Sentiment Monitor", task: "Severe distress detection", reason: "When extreme negative sentiment or distress keywords are detected, immediate human intervention is required" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Full conversation dashboard — live calls, transcripts, analytics, and flow editor" :
        ch.name === "WhatsApp" ? "\"Your support case #4821 has been resolved. Reply SURVEY to rate your experience.\"" :
        ch.name === "Telegram" ? "Monitor live call volume, escalation rate, and agent availability" :
        ch.name === "Discord" ? "Support team coordination — shared call reviews and coaching sessions" :
        ch.name === "Slack" ? "Use /calls, /sentiment, or /escalations to pull live support metrics" :
        ch.name === "Email" ? "Daily conversation digest, quality scores, and escalation summaries" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("assistpro", "https://assistpro.vercel.app"),
    projectUrl: "https://assistpro.vercel.app",
    stats: [
      { label: "Daily Conversations", value: "1,247" },
      { label: "Autonomous Resolution", value: "78%" },
      { label: "Avg. Handle Time", value: "3.2 min" },
      { label: "Cost per Interaction", value: "$0.42" },
    ],
  },
};

export default content;
