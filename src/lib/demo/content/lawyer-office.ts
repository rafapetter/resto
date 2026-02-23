import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "corporate-law", name: "Corporate Law", emoji: "🏢" },
      { id: "family-law", name: "Family Law", emoji: "👨‍👩‍👧" },
      { id: "criminal-defense", name: "Criminal Defense", emoji: "⚖️" },
      { id: "real-estate-law", name: "Real Estate Law", emoji: "🏠" },
      { id: "intellectual-property", name: "Intellectual Property", emoji: "💡" },
      { id: "immigration-law", name: "Immigration Law", emoji: "🌍" },
    ],
    verticals: [
      { id: "case-management", name: "Case Management" },
      { id: "document-automation", name: "Document Automation" },
      { id: "client-relations", name: "Client Relations" },
      { id: "billing-trust", name: "Billing & Trust Accounting" },
    ],
    features: [
      { id: "case-tracking", name: "Case Tracking" },
      { id: "document-generation", name: "Document Generation" },
      { id: "court-filing", name: "Court Filing" },
      { id: "time-tracking", name: "Time Tracking" },
      { id: "client-portal", name: "Client Portal" },
      { id: "conflict-checking", name: "Conflict Checking" },
    ],
    autoSelections: {
      industry: "corporate-law",
      vertical: "case-management",
      features: ["case-tracking", "document-generation", "time-tracking", "conflict-checking"],
      autonomy: {
        "case-tracking": "full",
        "document-generation": "supervised",
        "court-filing": "supervised",
        "time-tracking": "full",
        "client-portal": "full",
        "conflict-checking": "full",
      },
    },
    projectName: "LegalEdge Law",
    projectDescription: "AI-powered law firm management platform with intelligent case tracking, automated document generation, and integrated billing with IOLTA trust accounting.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "LegalEdge Law",
    projectBadge: "Legal",
    projectDescription: "Streamline law firm operations with AI-driven case management, automated document drafting, conflict checking, and billable hour tracking across all practice areas.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Good morning, Ms. Reeves. You have 14 active cases requiring attention today. The Henderson v. Marlow summary judgment motion is due Friday, the Zhang contract review is awaiting your final markup, and two new client intake consultations are scheduled this afternoon. I also ran overnight conflict checks on the 3 prospective clients — one flagged a potential conflict.",
      },
      {
        role: "user",
        content: "Start with the conflict flag. Which prospective client and what's the issue?",
      },
      {
        role: "assistant",
        content: "The conflict involves prospective client Rayburn Industries. They're seeking representation in a breach-of-contract dispute against Dillon Supply Co. The issue: Dillon Supply was a client of the firm in 2023 — associate James Park handled a vendor agreement negotiation for them. The matter is closed, but under Rule 1.9 (Duties to Former Clients), this may constitute a conflict if the current matter is substantially related. I've pulled the 2023 engagement file for your review.",
      },
      {
        role: "user",
        content: "Good catch. Table Rayburn for now until I review the file. What's the status on Henderson v. Marlow?",
      },
      {
        role: "assistant",
        content: "Henderson v. Marlow — summary judgment motion due Friday at 5 PM (Superior Court, Dept. 14). Here's where we stand:\n\n• **Statement of Undisputed Facts**: Drafted, 42 facts cited — needs your review\n• **Memorandum of Points & Authorities**: 80% complete, Research Agent identified 3 additional supporting cases from the 9th Circuit\n• **Declaration of Plaintiff**: Awaiting Henderson's signature — DocuSign sent yesterday, not yet signed\n• **Exhibits**: 18 of 22 exhibits compiled and Bates-stamped\n\nThe biggest risk is Henderson's unsigned declaration. Shall I have the paralegal follow up with a call?",
      },
      {
        role: "user",
        content: "Yes, have them call Henderson immediately. Also, log 1.5 hours to Henderson for my review this morning and prep the filing package.",
      },
      {
        role: "assistant",
        content: "Done — 1.5 hours logged to Henderson v. Marlow (matter #2024-0847) under your billing code at $425/hr. Paralegal team has been notified to call Henderson for the declaration signature. I'm assembling the e-filing package for Superior Court and will have the final bundle ready for your review by 3 PM tomorrow. One more item — the Zhang Industries contract review. Their general counsel is requesting the redline by end of day today.",
        action: {
          type: "approval",
          title: "Submit Court Filing Package",
          description: "Authorize preparation and e-filing of the Henderson v. Marlow summary judgment motion with the Superior Court (Case No. 2024-CV-03291, Dept. 14). Filing fee: $60. Package includes memorandum, statement of facts, plaintiff declaration (pending signature), and 22 exhibits.",
        },
      },
      {
        role: "user",
        content: "Approve the filing prep, but hold submission until Henderson signs. Send Zhang's GC a note that the redline will be over by 6 PM.",
      },
      {
        role: "assistant",
        content: "Filing package preparation approved — I'll hold the e-filing submission and alert you the moment Henderson's DocuSign comes through. I've sent a courtesy email to Zhang Industries' general counsel, Linda Park, confirming the redline delivery by 6 PM today. Your billable hours for this week are currently at 32.5 — you're on pace to exceed your 38-hour weekly target. The two intake consultations this afternoon are at 2:00 PM (estate planning referral) and 3:30 PM (commercial lease dispute). Intake questionnaires and conflict check results are already in your briefing folder.",
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning, Ms. Reeves. Here's your legal operations briefing for Thursday, February 20th.", durationMs: 3400 },
      { speaker: "agent", text: "You have 3 court deadlines this week. The Henderson v. Marlow summary judgment motion is due Friday — the filing package is 80% complete and awaiting a client declaration signature. The Lopez immigration petition has a USCIS response deadline on Monday, and the Greenfield LLC operating agreement needs to be executed by the partners before Wednesday.", durationMs: 11200 },
      { speaker: "agent", text: "Today's schedule includes 6 billable matters, 2 new client intake consultations this afternoon, and a 4:30 PM call with co-counsel on the DataStream patent case. A conflict check flagged a potential issue with prospective client Rayburn Industries — details are in your case queue for review.", durationMs: 10500 },
      { speaker: "agent", text: "Billing update: the firm logged 847 billable hours this month across all attorneys, with a 94% collection rate. Three client invoices totaling $42,600 are past 30 days. The IOLTA trust account balance is $318,400 with two scheduled disbursements pending your authorization today.", durationMs: 10800 },
    ],
    summary: "Morning briefing covered 3 court deadlines (summary judgment, USCIS petition, LLC agreement), 2 new client intake sessions, a conflict check flag on Rayburn Industries, and billing status including 94% collection rate and pending IOLTA disbursements.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Clio Manage", icon: "briefcase", category: "Practice Mgmt", description: "Legal practice management — cases, contacts, calendaring, and billing" },
      { name: "Westlaw Edge", icon: "search", category: "Legal Research", description: "AI-powered legal research, case law, statutes, and secondary sources" },
      { name: "LexisNexis", icon: "book-open", category: "Legal Research", description: "Legal research, public records, and litigation analytics" },
      { name: "Tyler Technologies", icon: "gavel", category: "Court Filing", description: "E-filing integration for state and federal court submissions" },
      { name: "DocuSign", icon: "pen-tool", category: "Document Signing", description: "Electronic signatures for client agreements, declarations, and contracts" },
      { name: "LawPay", icon: "landmark", category: "Trust Accounting", description: "IOLTA-compliant payment processing and trust account management" },
      COMMON_INTEGRATIONS.googleEmail,
      COMMON_INTEGRATIONS.calendar,
      COMMON_INTEGRATIONS.slack,
      COMMON_INTEGRATIONS.twilio,
      COMMON_INTEGRATIONS.stripe,
      COMMON_INTEGRATIONS.github,
      COMMON_INTEGRATIONS.vercel,
      COMMON_INTEGRATIONS.sentry,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: "Design case and matter data model with relational linking", stage: "plan", status: "complete" },
      { title: "Define conflict-of-interest rules engine and entity resolution", stage: "plan", status: "complete" },
      { title: "Build case management dashboard with deadlines and status tracking", stage: "build", status: "complete" },
      { title: "Implement document generation engine with clause library", stage: "build", status: "complete" },
      { title: "Create e-filing integration with court submission APIs", stage: "build", status: "active" },
      { title: "Build time tracking and IOLTA trust accounting system", stage: "build", status: "pending" },
      { title: "Set up client portal with secure document sharing", stage: "launch", status: "pending" },
      { title: "Deploy with ABA compliance audit and data encryption at rest", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "cases", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[caseId]", type: "folder", children: [
                  { name: "page.tsx", type: "file" },
                  { name: "documents.tsx", type: "file" },
                  { name: "timeline.tsx", type: "file" },
                ] },
              ] },
              { name: "clients", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[clientId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "documents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "billing", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "calendar", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "conflicts", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "cases", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "clients", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "documents", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "billing", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "court-filings", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "conflicts", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "docusign", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "court-updates", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
          { name: "portal", type: "folder", children: [
            { name: "page.tsx", type: "file" },
            { name: "documents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            { name: "messages", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          ] },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "conflict-checker.ts", type: "file" },
          { name: "document-generator.ts", type: "file" },
          { name: "court-efiling.ts", type: "file" },
          { name: "iolta-ledger.ts", type: "file" },
          { name: "time-tracker.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Legal Procedures", icon: "gavel", count: 38 },
      { name: "Court Rules", icon: "scale", count: 45 },
      { name: "Practice Area Guides", icon: "book-open", count: 26 },
      { name: "Ethics Opinions", icon: "shield", count: 22 },
      { name: "Fee Schedules & Billing", icon: "receipt", count: 18 },
    ],
    documents: [
      { title: "Civil Litigation Procedure Manual", category: "Legal Procedures", tier: "index", lines: 110, crossRefs: ["Summary Judgment Motion Checklist", "Discovery Protocol Guide"] },
      { title: "Summary Judgment Motion Checklist", category: "Legal Procedures", tier: "detail", lines: 380 },
      { title: "Discovery Protocol Guide", category: "Legal Procedures", tier: "detail", lines: 460 },
      { title: "State Superior Court Local Rules", category: "Court Rules", tier: "summary", lines: 520, crossRefs: ["E-Filing Requirements by Jurisdiction"] },
      { title: "E-Filing Requirements by Jurisdiction", category: "Court Rules", tier: "detail", lines: 340 },
      { title: "Federal Rules of Civil Procedure Reference", category: "Court Rules", tier: "detail", lines: 890 },
      { title: "Conflict of Interest Rules (ABA Model Rules 1.7-1.9)", category: "Ethics Opinions", tier: "summary", lines: 210, crossRefs: ["Civil Litigation Procedure Manual"] },
      { title: "IOLTA Trust Account Compliance Guide", category: "Fee Schedules & Billing", tier: "summary", lines: 275, crossRefs: ["State Bar Fee Schedule 2025"] },
      { title: "State Bar Fee Schedule 2025", category: "Fee Schedules & Billing", tier: "detail", lines: 190 },
      { title: "Corporate M&A Due Diligence Playbook", category: "Practice Area Guides", tier: "summary", lines: 430, crossRefs: ["Discovery Protocol Guide"] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Cases Resolved (Last 6 Months)",
        type: "bar",
        data: [
          { name: "Sep", value: 28 },
          { name: "Oct", value: 34 },
          { name: "Nov", value: 31 },
          { name: "Dec", value: 22 },
          { name: "Jan", value: 37 },
          { name: "Feb", value: 41 },
        ],
      },
      {
        label: "Billable Hours by Practice Area",
        type: "bar",
        data: [
          { name: "Corporate", value: 312 },
          { name: "Litigation", value: 287 },
          { name: "Real Estate", value: 164 },
          { name: "IP", value: 198 },
          { name: "Family", value: 142 },
          { name: "Immigration", value: 118 },
        ],
      },
    ],
    agents: [
      { name: "Managing Partner AI", role: "Orchestrates firm-wide operations, case allocation, and strategic decisions", avatar: "⚖️", color: "blue", tasks: ["Case assignment", "Firm performance oversight", "Resource allocation"] },
      { name: "Case Manager", role: "Tracks case progress, deadlines, and deliverables across all matters", avatar: "📂", color: "emerald", tasks: ["Deadline monitoring", "Task assignment", "Status reporting"], reportsTo: "Managing Partner AI" },
      { name: "Research Agent", role: "Conducts legal research and identifies relevant case law and statutes", avatar: "🔍", color: "violet", tasks: ["Case law research", "Statutory analysis", "Precedent identification"], reportsTo: "Case Manager" },
      { name: "Document Agent", role: "Drafts, assembles, and manages legal documents and filings", avatar: "📝", color: "amber", tasks: ["Document generation", "Contract redlining", "Filing package assembly"], reportsTo: "Case Manager" },
      { name: "Billing Agent", role: "Manages time entries, invoicing, and trust accounting", avatar: "💰", color: "green", tasks: ["Time entry processing", "Invoice generation", "IOLTA reconciliation"], reportsTo: "Managing Partner AI" },
      { name: "Client Intake Agent", role: "Handles new client onboarding, conflict checks, and engagement letters", avatar: "🤝", color: "cyan", tasks: ["Intake questionnaires", "Conflict screening", "Engagement letter drafting"], reportsTo: "Managing Partner AI" },
      { name: "Compliance Monitor", role: "Ensures ethics compliance, deadline adherence, and regulatory obligations", avatar: "🛡️", color: "rose", tasks: ["Ethics rule monitoring", "Bar compliance tracking", "Statute of limitations alerts"], reportsTo: "Managing Partner AI" },
    ],
    humanReviewPoints: [
      { agent: "Document Agent", task: "Court filing submission", reason: "All court filings require attorney review and signature before submission per bar association rules" },
      { agent: "Client Intake Agent", task: "Conflict of interest resolution", reason: "Potential conflicts under Rules 1.7-1.9 require partner-level review and client consent determination" },
      { agent: "Billing Agent", task: "IOLTA trust disbursement", reason: "Trust account disbursements require attorney authorization to comply with state bar trust accounting rules" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Full case management dashboard — matters, documents, billing, and court deadlines" :
        ch.name === "WhatsApp" ? "\"Ms. Reeves, Henderson signed the declaration via DocuSign. Filing package is ready.\"" :
        ch.name === "Telegram" ? "Quick case status checks and deadline alerts on the go" :
        ch.name === "Discord" ? "Practice group channels for case strategy discussions and research sharing" :
        ch.name === "Slack" ? "Use /case, /conflicts, or /billing to pull live firm data from any channel" :
        ch.name === "Email" ? "Daily docket summaries, filing confirmations, and client communication logs" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("legaledge-law", "https://legaledge-law.vercel.app"),
    projectUrl: "https://legaledge-law.vercel.app",
    stats: [
      { label: "Cases Managed", value: "1,200+" },
      { label: "Document Automation", value: "85%" },
      { label: "Billable Recovery", value: "94%" },
      { label: "Conflict Check Speed", value: "<2s" },
    ],
  },
};

export default content;
