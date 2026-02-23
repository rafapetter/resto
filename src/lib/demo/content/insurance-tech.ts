import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "property-casualty", name: "Property & Casualty", emoji: "🏠" },
      { id: "life-insurance", name: "Life Insurance", emoji: "🛡️" },
      { id: "health-insurance", name: "Health Insurance", emoji: "🏥" },
      { id: "auto-insurance", name: "Auto Insurance", emoji: "🚗" },
      { id: "commercial-insurance", name: "Commercial Insurance", emoji: "🏢" },
      { id: "reinsurance", name: "Reinsurance", emoji: "🔄" },
    ],
    verticals: [
      { id: "policy-admin", name: "Policy Administration" },
      { id: "claims-processing", name: "Claims Processing" },
      { id: "underwriting", name: "Underwriting" },
      { id: "risk-assessment", name: "Risk Assessment" },
    ],
    features: [
      { id: "policy-management", name: "Policy Management" },
      { id: "claims-automation", name: "Claims Automation" },
      { id: "underwriting-engine", name: "Underwriting Engine" },
      { id: "risk-scoring", name: "Risk Scoring" },
      { id: "agent-portal", name: "Agent Portal" },
      { id: "compliance-reporting", name: "Compliance Reporting" },
    ],
    autoSelections: {
      industry: "property-casualty",
      vertical: "claims-processing",
      features: ["policy-management", "claims-automation", "underwriting-engine", "risk-scoring"],
      autonomy: {
        "policy-management": "full",
        "claims-automation": "full",
        "underwriting-engine": "supervised",
        "risk-scoring": "full",
        "agent-portal": "full",
        "compliance-reporting": "full",
      },
    },
    projectName: "InsureNet",
    projectDescription: "AI-powered insurance operations platform with automated claims processing, intelligent underwriting, real-time risk scoring, and regulatory compliance management for modern insurers.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "InsureNet",
    projectBadge: "Insurance",
    projectDescription: "Streamline insurance operations end-to-end — from policy issuance and underwriting to claims adjudication and fraud detection, with built-in regulatory compliance and agent performance tracking.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Good morning. Operations snapshot: 847 claims in the active queue — 312 are pending initial review, 189 require adjuster assignment, and 46 are flagged for potential fraud. Underwriting queue has 73 applications, with 12 high-value commercial policies awaiting senior review. Policy renewals: 1,240 policies are due within the next 30 days, and the NAIC quarterly filing deadline is in 18 days.",
      },
      {
        role: "user",
        content: "Let's start with the fraud flags. What's the AI picking up on those 46 claims?",
      },
      {
        role: "assistant",
        content: "The fraud detection engine flagged 46 claims across three risk tiers:\n\n**Critical (8 claims, $1.2M total exposure)**:\n• 3 staged auto collision claims — same body shop across all three, filed within 72 hours of each other\n• 2 water damage claims in the same apartment complex — both filed the same day with identical contractor estimates\n• 3 medical claims with billing anomalies — CPT code patterns inconsistent with stated injuries\n\n**High (16 claims, $890K exposure)**:\n• Policy inception-to-claim timing under 45 days on 9 claims\n• 4 claims with claimant address mismatches vs. policy records\n• 3 property claims where damage photos have metadata inconsistencies\n\n**Moderate (22 claims, $340K exposure)**:\n• Mostly pattern-based triggers — repeat claimants, above-average amounts for claim type\n\nThe 8 critical claims have a 94% confidence score. I recommend routing them to your Special Investigations Unit immediately.",
        action: {
          type: "approval",
          title: "Route Critical Fraud Cases to SIU",
          description: "Route 8 critical fraud-flagged claims ($1.2M total exposure) to the Special Investigations Unit for immediate review. Includes 3 staged collision claims, 2 suspicious water damage claims, and 3 medical billing anomaly claims. Auto-generates SIU referral packets with evidence summaries.",
        },
      },
      {
        role: "user",
        content: "Approved. Now walk me through the underwriting queue — especially those 12 commercial policies.",
      },
      {
        role: "assistant",
        content: "SIU referrals submitted. Now for the underwriting queue:\n\n**12 Commercial Policies Pending Senior Review:**\n\n• **Meridian Construction Group** — $5M general liability + $2M umbrella. Risk score: 72/100. Clean loss history but expanding into seismic zone operations. Needs reinsurance treaty review.\n• **Pacific Coast Logistics** — $3.5M fleet policy, 84 vehicles. Risk score: 65/100. Three prior claims in 24 months, all under $50K. Telematics data shows improving driver behavior.\n• **Harborview Hotels** — $8M property + liability package. Risk score: 58/100. Two properties in hurricane-prone zones. Current rates are 18% below market for the risk profile.\n\nThe remaining 9 are mid-market accounts in the $500K-$2M range with risk scores above 75 — those can be auto-approved per your underwriting guidelines.\n\nFor the three I highlighted, I've prepared risk assessment reports with pricing recommendations. Harborview needs a rate adjustment — my actuarial model suggests a 22% increase to achieve target loss ratio.",
      },
      {
        role: "user",
        content: "Auto-approve the 9 mid-market policies. Flag Harborview for re-rating and schedule a review call with the broker. What about the renewal pipeline?",
      },
      {
        role: "assistant",
        content: "Done — 9 mid-market policies approved and bound. Harborview flagged for re-rating, and I've requested a call slot with their broker for Wednesday at 2 PM.\n\nRenewal pipeline for the next 30 days:\n\n• **1,240 total policies due** — estimated premium volume of $18.6M\n• **Auto-renew eligible**: 892 policies (72%) — clean loss history, no material changes, within rate guidelines\n• **Rate adjustment needed**: 214 policies (17%) — actuarial models indicate premium changes ranging from -5% to +30%\n• **At-risk of non-renewal**: 134 policies (11%) — 68 have received competitor quotes, 42 have filed complaints, 24 are in claims-heavy segments\n\nThe at-risk group represents $4.2M in annual premium. I've prepared retention offers for the top 50 by premium value — a combination of loyalty discounts, coverage enhancements, and bundling incentives. Estimated retention lift: 35-40%.",
      },
      {
        role: "user",
        content: "Launch the auto-renewals and send retention offers to the top 50 at-risk accounts. Make sure compliance signs off on the rate adjustments before they go out.",
      },
      {
        role: "assistant",
        content: "Processing now:\n\n• **Auto-renewals**: 892 policies queued for renewal processing — certificates and declarations will be generated and sent to policyholders 15 days before expiration per state requirements\n• **Retention offers**: 50 personalized retention packages being routed to assigned agents for delivery — each includes a comparison sheet showing current vs. proposed coverage\n• **Rate adjustments**: 214 policies flagged for compliance review — submitted to the Compliance Officer agent for state-by-state rate filing verification before policyholder notification\n\nTimeline: Auto-renewals begin processing today. Retention offers will reach agents by end of day. Rate adjustments will be cleared through compliance within 48 hours — any that require state DOI approval will be escalated to you.\n\nI'll also generate the NAIC quarterly filing draft this week so you have time to review before the deadline.",
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning. Here's your InsureNet operations briefing for February 20th.", durationMs: 3200 },
      { speaker: "agent", text: "Claims queue stands at 847 active claims with 46 flagged for potential fraud totaling $2.4 million in exposure. Eight critical fraud cases have a 94% confidence score and should be routed to your Special Investigations Unit today. The remaining claims pipeline is processing within SLA targets.", durationMs: 10800 },
      { speaker: "agent", text: "Underwriting has 73 pending applications. Twelve high-value commercial policies require senior review, including an $8 million Harborview Hotels package that needs re-rating — current premiums are 18% below market for the risk profile. Nine mid-market policies are eligible for auto-approval per your guidelines.", durationMs: 9600 },
      { speaker: "agent", text: "Renewal pipeline shows 1,240 policies due within 30 days representing $18.6 million in premium. 134 policies are at risk of non-renewal with $4.2 million in annual premium at stake. Retention offers are prepared for the top 50. Also, your NAIC quarterly filing deadline is in 18 days — I'll have the draft ready for your review by end of this week.", durationMs: 11200 },
    ],
    summary: "Operations briefing covered 847 active claims with 46 fraud flags, 73 underwriting applications including 12 high-value commercial policies, 1,240 upcoming renewals with 134 at-risk accounts, and the NAIC quarterly filing deadline in 18 days.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Guidewire", icon: "shield", category: "Policy Admin", description: "Policy administration, billing, and claims management platform" },
      { name: "Verisk", icon: "bar-chart-2", category: "Data Analytics", description: "Insurance data analytics, risk assessment, and actuarial modeling" },
      { name: "LexisNexis Risk", icon: "search", category: "Risk Intelligence", description: "Identity verification, claims history, and risk scoring data" },
      { name: "Actuarial Workbench", icon: "calculator", category: "Actuarial", description: "Loss reserving, pricing models, and mortality/morbidity tables" },
      { name: "ClaimsPro", icon: "file-check", category: "Claims", description: "Claims adjudication, FNOL intake, and settlement workflows" },
      { name: "RiskMeter", icon: "activity", category: "Underwriting", description: "Automated underwriting rules engine with real-time risk scoring" },
      COMMON_INTEGRATIONS.stripe,
      COMMON_INTEGRATIONS.googleEmail,
      COMMON_INTEGRATIONS.calendar,
      COMMON_INTEGRATIONS.slack,
      COMMON_INTEGRATIONS.analytics,
      COMMON_INTEGRATIONS.sentry,
      COMMON_INTEGRATIONS.github,
      COMMON_INTEGRATIONS.vercel,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: "Design policy and claims data models with state-specific compliance fields", stage: "plan", status: "complete" },
      { title: "Map Guidewire API endpoints and configure webhook event subscriptions", stage: "plan", status: "complete" },
      { title: "Build policy management dashboard with lifecycle tracking and endorsements", stage: "build", status: "complete" },
      { title: "Implement claims intake and automated triage with fraud detection scoring", stage: "build", status: "complete" },
      { title: "Create underwriting rules engine with risk scoring and auto-bind logic", stage: "build", status: "active" },
      { title: "Build agent portal with commission tracking and book-of-business views", stage: "build", status: "pending" },
      { title: "Integrate regulatory compliance reporting for NAIC and state DOI filings", stage: "launch", status: "pending" },
      { title: "Deploy with SOC 2 compliance checks and disaster recovery configuration", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "policies", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[policyId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "claims", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[claimId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "underwriting", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "risk", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "agents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "compliance", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "policies", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "claims", type: "folder", children: [
                { name: "route.ts", type: "file" },
                { name: "fraud-check", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "underwriting", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "risk", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "agents", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "guidewire", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "claims-intake", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "guidewire-client.ts", type: "file" },
          { name: "underwriting-engine.ts", type: "file" },
          { name: "fraud-detector.ts", type: "file" },
          { name: "risk-scorer.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Insurance Regulations", icon: "scale", count: 42 },
      { name: "Underwriting Guidelines", icon: "clipboard-check", count: 28 },
      { name: "Claims Procedures", icon: "file-text", count: 36 },
      { name: "Actuarial Tables", icon: "calculator", count: 19 },
      { name: "Compliance Requirements", icon: "shield-check", count: 24 },
    ],
    documents: [
      { title: "NAIC Model Laws & Regulations Reference", category: "Insurance Regulations", tier: "index", lines: 120, crossRefs: ["State Filing Requirements Guide", "Compliance Audit Checklist"] },
      { title: "State Filing Requirements Guide", category: "Insurance Regulations", tier: "detail", lines: 380 },
      { title: "Commercial Lines Underwriting Manual", category: "Underwriting Guidelines", tier: "summary", lines: 290, crossRefs: ["Risk Classification Standards", "Actuarial Pricing Models"] },
      { title: "Risk Classification Standards", category: "Underwriting Guidelines", tier: "detail", lines: 240 },
      { title: "Claims Adjudication Procedures", category: "Claims Procedures", tier: "summary", lines: 210, crossRefs: ["Fraud Investigation Protocols"] },
      { title: "Fraud Investigation Protocols", category: "Claims Procedures", tier: "detail", lines: 320 },
      { title: "Actuarial Pricing Models — P&C Lines", category: "Actuarial Tables", tier: "detail", lines: 450, crossRefs: ["Commercial Lines Underwriting Manual"] },
      { title: "Loss Reserve Development Triangles", category: "Actuarial Tables", tier: "detail", lines: 280 },
      { title: "Compliance Audit Checklist", category: "Compliance Requirements", tier: "summary", lines: 155, crossRefs: ["NAIC Model Laws & Regulations Reference"] },
      { title: "Anti-Fraud Program Standards", category: "Compliance Requirements", tier: "detail", lines: 195, crossRefs: ["Fraud Investigation Protocols", "Claims Adjudication Procedures"] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Claims Processed (Weekly)",
        type: "bar",
        data: [
          { name: "W1", value: 312 },
          { name: "W2", value: 348 },
          { name: "W3", value: 295 },
          { name: "W4", value: 387 },
          { name: "W5", value: 410 },
          { name: "W6", value: 365 },
          { name: "W7", value: 422 },
        ],
      },
      {
        label: "Loss Ratio (%)",
        type: "line",
        data: [
          { name: "Sep", value: 68 },
          { name: "Oct", value: 65 },
          { name: "Nov", value: 71 },
          { name: "Dec", value: 74 },
          { name: "Jan", value: 62 },
          { name: "Feb", value: 59 },
        ],
      },
    ],
    agents: [
      { name: "Chief Underwriter AI", role: "Orchestrates all insurance operations, underwriting decisions, and risk management", avatar: "🛡️", color: "blue", tasks: ["Underwriting oversight", "Risk portfolio management", "Operations coordination"] },
      { name: "Claims Adjuster", role: "Processes and evaluates insurance claims for settlement", avatar: "📋", color: "emerald", tasks: ["Claim evaluation", "Settlement calculation", "Adjuster assignment"], reportsTo: "Chief Underwriter AI" },
      { name: "Policy Manager", role: "Handles policy lifecycle from issuance to renewal", avatar: "📄", color: "violet", tasks: ["Policy issuance", "Endorsement processing", "Renewal management"], reportsTo: "Chief Underwriter AI" },
      { name: "Risk Assessor", role: "Evaluates and scores risk profiles for underwriting decisions", avatar: "📊", color: "amber", tasks: ["Risk scoring", "Exposure analysis", "Portfolio risk modeling"], reportsTo: "Chief Underwriter AI" },
      { name: "Fraud Detector", role: "Identifies suspicious claims and patterns indicative of fraud", avatar: "🔍", color: "rose", tasks: ["Pattern analysis", "Red flag detection", "SIU referral generation"], reportsTo: "Claims Adjuster" },
      { name: "Compliance Officer", role: "Ensures regulatory compliance across all insurance operations", avatar: "⚖️", color: "cyan", tasks: ["Rate filing verification", "NAIC reporting", "State DOI compliance"], reportsTo: "Chief Underwriter AI" },
      { name: "Customer Service Agent", role: "Handles policyholder inquiries, quotes, and service requests", avatar: "💬", color: "green", tasks: ["Quote generation", "Policy inquiries", "Claims status updates"], reportsTo: "Policy Manager" },
    ],
    humanReviewPoints: [
      { agent: "Chief Underwriter AI", task: "High-value commercial policy binding", reason: "Commercial policies exceeding $5M in coverage require senior underwriter sign-off and reinsurance treaty verification" },
      { agent: "Claims Adjuster", task: "Claim settlement above authority limit", reason: "Settlements exceeding $100K require claims manager approval and may need reserve adjustment authorization" },
      { agent: "Fraud Detector", task: "SIU referral for organized fraud ring", reason: "Multi-claim fraud patterns involving potential organized rings require legal counsel review before investigation escalation" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Full insurance operations dashboard — policies, claims, underwriting, and compliance reporting" :
        ch.name === "WhatsApp" ? "\"Claim #CLM-4821 approved for $12,400 settlement. Policyholder notified.\"" :
        ch.name === "Telegram" ? "Real-time claims alerts, fraud flags, and underwriting queue updates" :
        ch.name === "Discord" ? "Team operations room — coordinate claims reviews, underwriting decisions, and compliance filings" :
        ch.name === "Slack" ? "Use /claims, /policies, or /underwriting for instant insurance operations data" :
        ch.name === "Email" ? "Daily claims digest, renewal pipeline reports, and regulatory deadline reminders" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("insurenet", "https://insurenet.vercel.app"),
    projectUrl: "https://insurenet.vercel.app",
    stats: [
      { label: "Policies Managed", value: "50,000+" },
      { label: "Claims Auto-Processed", value: "72%" },
      { label: "Fraud Detection Rate", value: "96%" },
      { label: "Underwriting Speed", value: "3x faster" },
    ],
  },
};

export default content;
