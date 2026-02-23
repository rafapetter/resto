import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "hospital", name: "Hospital Systems", emoji: "🏥" },
      { id: "urgent-care", name: "Urgent Care", emoji: "🚑" },
      { id: "rehabilitation", name: "Rehabilitation", emoji: "🦽" },
      { id: "surgical-center", name: "Surgical Centers", emoji: "🔪" },
      { id: "long-term-care", name: "Long-Term Care", emoji: "🏠" },
      { id: "behavioral-health", name: "Behavioral Health", emoji: "🧠" },
    ],
    verticals: [
      { id: "bed-management", name: "Bed & Capacity Management" },
      { id: "staff-scheduling", name: "Staff Scheduling" },
      { id: "patient-flow", name: "Patient Flow Optimization" },
      { id: "quality-metrics", name: "Quality & Safety Metrics" },
    ],
    features: [
      { id: "census-tracking", name: "Real-Time Census Tracking" },
      { id: "nurse-scheduling", name: "Nurse Scheduling" },
      { id: "discharge-planning", name: "Discharge Planning" },
      { id: "incident-reporting", name: "Incident Reporting" },
      { id: "supply-management", name: "Supply Chain Management" },
      { id: "patient-satisfaction", name: "Patient Satisfaction Surveys" },
    ],
    autoSelections: {
      industry: "hospital",
      vertical: "bed-management",
      features: ["census-tracking", "nurse-scheduling", "discharge-planning", "incident-reporting"],
      autonomy: {
        "census-tracking": "full",
        "nurse-scheduling": "supervised",
        "discharge-planning": "supervised",
        "incident-reporting": "full",
        "supply-management": "full",
        "patient-satisfaction": "full",
      },
    },
    projectName: "CareHub Hospital",
    projectDescription: "Enterprise hospital management platform with real-time census tracking, AI-driven staff scheduling, and predictive discharge planning.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "CareHub Hospital",
    projectBadge: "Hospital Ops",
    projectDescription: "Unify hospital operations across departments — real-time bed management, predictive staffing, and quality metric dashboards for multi-site health systems.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Good morning. Current hospital census: 312 of 340 beds occupied (91.8% capacity). ICU is at 96% — 24 of 25 beds filled. I've identified 8 patients across med-surg who meet discharge criteria within the next 12 hours.",
      },
      {
        role: "user",
        content: "We're expecting a surge from the ER — what's our capacity projection for the next 6 hours?",
      },
      {
        role: "assistant",
        content: "Based on current ER volume (42 patients, 11 pending admission) and historical Thursday patterns, I project we'll need 18 additional beds by 4 PM. With the 8 anticipated discharges and 3 scheduled transfers to skilled nursing, net availability should be 13 beds. I recommend activating the surge protocol for the East Wing to cover the 5-bed gap.",
      },
      {
        role: "user",
        content: "Activate the surge protocol. Also, how's our nursing coverage for tonight's shift?",
      },
      {
        role: "assistant",
        content: "Surge protocol activated for East Wing — environmental services has been notified to prep 6 beds. For tonight's night shift: we're staffed at 94% across units, but the Cardiac Step-Down unit is short 1 RN. I found two float pool nurses available — Sarah Kim (cardiac-certified, 4.8 rating) and Marcus Chen (general med-surg). I'd recommend Sarah given the unit specialization.",
        action: {
          type: "approval",
          title: "Assign Float Nurse to Cardiac Step-Down",
          description: "Assign Sarah Kim (RN, BSN, Cardiac-Certified) from float pool to Cardiac Step-Down Unit for tonight's night shift (7 PM – 7 AM). This fills the staffing gap and maintains required nurse-to-patient ratio of 1:4.",
        },
      },
      {
        role: "user",
        content: "Approve Sarah. What about the quality metrics for this week?",
      },
      {
        role: "assistant",
        content: "Sarah is confirmed for tonight's shift. Here's the weekly quality snapshot:\n\n• **HCAHPS Score**: 4.2/5.0 (up from 4.0 last week)\n• **Falls**: 2 incidents (both low-harm, per protocol) — down from 5\n• **CLABSI Rate**: 0 this month (meeting Zero Harm target)\n• **Door-to-Bed Time**: Average 38 min (target: <45 min)\n• **30-Day Readmission**: 8.4% (below national avg of 11.2%)\n\nThe falls reduction is significant — the new bedside handoff protocol appears to be working. I've drafted a summary for the Patient Safety Committee meeting on Friday.",
      },
      {
        role: "user",
        content: "Great. Send the summary to the committee and remind me 30 minutes before the meeting.",
      },
      {
        role: "assistant",
        content: "Done. The quality metrics summary has been distributed to the 9 Patient Safety Committee members, and I've set a reminder for you at 1:30 PM Friday. I've also flagged that Dr. Rodriguez requested an additional agenda item about the new sepsis screening protocol — I've added it to the meeting doc.",
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning. Here's your hospital operations briefing for Thursday, February 20th.", durationMs: 3400 },
      { speaker: "agent", text: "Overall census is 312 of 340 beds, or 91.8% occupancy. ICU is near capacity at 96%. The Emergency Department currently has 42 patients, with 11 awaiting inpatient admission. Projected bed demand over the next 6 hours exceeds current availability by approximately 5 beds.", durationMs: 10200 },
      { speaker: "agent", text: "Staffing: day shift is fully covered across all units. Night shift has one gap in Cardiac Step-Down — a float pool assignment is pending your approval. Overtime hours are trending 12% below last month, which is on track for the budget target.", durationMs: 9500 },
      { speaker: "agent", text: "Quality update: zero hospital-acquired infections this week, HCAHPS trending upward at 4.2, and the Patient Safety Committee meets Friday at 2 PM. One supply alert — surgical glove inventory in OR Suite 3 is below par level. A reorder has been submitted automatically.", durationMs: 10800 },
    ],
    summary: "Briefing covered hospital census (91.8%), ER surge projections, staffing gaps in Cardiac Step-Down, quality metrics improvements, and a supply reorder for OR Suite 3.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Epic Cerner", icon: "heart-pulse", category: "Clinical", description: "Hospital-wide EHR for clinical documentation, CPOE, and patient records" },
      { name: "TeleTracking", icon: "bed", category: "Operations", description: "Real-time bed management, patient flow, and transport coordination" },
      { name: "Kronos Workforce", icon: "clock", category: "HR", description: "Nurse scheduling, time tracking, and labor analytics" },
      { name: "Pyxis MedStation", icon: "pill", category: "Pharmacy", description: "Automated medication dispensing and controlled substance tracking" },
      { name: "Press Ganey", icon: "star", category: "Quality", description: "Patient satisfaction surveys and HCAHPS score management" },
      { name: "RL Datix", icon: "alert-triangle", category: "Safety", description: "Incident reporting, risk management, and safety event tracking" },
      { name: "GHX Supply Chain", icon: "package", category: "Supply Chain", description: "Medical supply procurement, inventory management, and vendor contracts" },
      COMMON_INTEGRATIONS.googleEmail,
      COMMON_INTEGRATIONS.slack,
      COMMON_INTEGRATIONS.calendar,
      COMMON_INTEGRATIONS.twilio,
      COMMON_INTEGRATIONS.github,
      COMMON_INTEGRATIONS.vercel,
      COMMON_INTEGRATIONS.sentry,
      COMMON_INTEGRATIONS.analytics,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: "Design real-time census data model with HL7 FHIR mapping", stage: "plan", status: "complete" },
      { title: "Define staffing ratio rules and scheduling constraints", stage: "plan", status: "complete" },
      { title: "Build live bed management dashboard with unit views", stage: "build", status: "complete" },
      { title: "Implement nurse scheduling engine with float pool logic", stage: "build", status: "complete" },
      { title: "Create discharge prediction model using historical data", stage: "build", status: "active" },
      { title: "Build quality metrics dashboard with HCAHPS integration", stage: "build", status: "pending" },
      { title: "Set up real-time alerting for capacity and safety events", stage: "launch", status: "pending" },
      { title: "Deploy with HA configuration and disaster recovery plan", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "census", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "beds", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[unitId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "staffing", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "quality", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "incidents", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "discharge", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "census", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "beds", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "staffing", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "incidents", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "hl7", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "alerts", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "hl7-parser.ts", type: "file" },
          { name: "bed-optimizer.ts", type: "file" },
          { name: "staff-scheduler.ts", type: "file" },
          { name: "discharge-predictor.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Operational Protocols", icon: "clipboard-list", count: 32 },
      { name: "Regulatory Compliance", icon: "shield", count: 28 },
      { name: "Clinical Guidelines", icon: "heart-pulse", count: 45 },
      { name: "Quality Standards", icon: "award", count: 22 },
    ],
    documents: [
      { title: "Hospital Surge Protocol", category: "Operational Protocols", tier: "index", lines: 95, crossRefs: ["Bed Management SOP", "Emergency Department Overflow Plan"] },
      { title: "Bed Management SOP", category: "Operational Protocols", tier: "detail", lines: 420 },
      { title: "Emergency Department Overflow Plan", category: "Operational Protocols", tier: "detail", lines: 310 },
      { title: "Joint Commission Readiness Guide", category: "Regulatory Compliance", tier: "summary", lines: 240, crossRefs: ["HCAHPS Survey Administration Protocol"] },
      { title: "Nurse-to-Patient Ratio Requirements by State", category: "Regulatory Compliance", tier: "detail", lines: 580 },
      { title: "HCAHPS Survey Administration Protocol", category: "Quality Standards", tier: "summary", lines: 165 },
      { title: "Sepsis Screening Protocol (CMS SEP-1)", category: "Clinical Guidelines", tier: "detail", lines: 390, crossRefs: ["Hospital Surge Protocol"] },
      { title: "Falls Prevention Program Guide", category: "Quality Standards", tier: "summary", lines: 210, crossRefs: ["Joint Commission Readiness Guide"] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Bed Occupancy Rate (%)",
        type: "line",
        data: [
          { name: "Sep", value: 84 },
          { name: "Oct", value: 87 },
          { name: "Nov", value: 91 },
          { name: "Dec", value: 95 },
          { name: "Jan", value: 89 },
          { name: "Feb", value: 92 },
        ],
      },
      {
        label: "Overtime Hours by Department",
        type: "bar",
        data: [
          { name: "ICU", value: 186 },
          { name: "Med-Surg", value: 142 },
          { name: "ER", value: 210 },
          { name: "OR", value: 98 },
          { name: "L&D", value: 64 },
          { name: "Rehab", value: 45 },
        ],
      },
    ],
    agents: [
      { name: "Operations Commander", role: "Orchestrates hospital-wide operations and resource allocation", avatar: "🏥", color: "blue", tasks: ["Census management", "Surge protocol activation", "Cross-department coordination"] },
      { name: "Bed Manager", role: "Optimizes bed assignments and patient placement", avatar: "🛏️", color: "emerald", tasks: ["Bed assignment optimization", "Transfer coordination", "Housekeeping dispatch"], reportsTo: "Operations Commander" },
      { name: "Staffing Coordinator", role: "Manages nurse scheduling and float pool assignments", avatar: "👩‍⚕️", color: "violet", tasks: ["Shift scheduling", "Float pool deployment", "Overtime monitoring"], reportsTo: "Operations Commander" },
      { name: "Discharge Planner", role: "Predicts and facilitates patient discharges", avatar: "📋", color: "amber", tasks: ["Discharge readiness scoring", "Care transition plans", "Follow-up scheduling"], reportsTo: "Operations Commander" },
      { name: "Quality Sentinel", role: "Monitors patient safety and quality indicators", avatar: "⭐", color: "rose", tasks: ["Incident tracking", "HCAHPS monitoring", "Compliance audits"], reportsTo: "Operations Commander" },
      { name: "Supply Agent", role: "Tracks inventory levels and automates reorders", avatar: "📦", color: "cyan", tasks: ["Par level monitoring", "Auto-reorder triggers", "Vendor management"], reportsTo: "Operations Commander" },
      { name: "ED Flow Agent", role: "Manages emergency department throughput", avatar: "🚑", color: "red", tasks: ["Triage queue optimization", "Admission bed requests", "Wait time management"], reportsTo: "Bed Manager" },
      { name: "Transport Agent", role: "Coordinates patient transport across facilities", avatar: "🚶", color: "slate", tasks: ["Transport dispatch", "Route optimization", "Equipment tracking"], reportsTo: "Bed Manager" },
      { name: "Compliance Reporter", role: "Generates regulatory reports and audit documentation", avatar: "📊", color: "green", tasks: ["CMS reporting", "State survey prep", "Joint Commission documentation"], reportsTo: "Quality Sentinel" },
    ],
    humanReviewPoints: [
      { agent: "Staffing Coordinator", task: "Mandatory overtime assignment", reason: "Labor agreements require nurse manager approval before mandating overtime shifts" },
      { agent: "Discharge Planner", task: "Against-medical-advice discharge", reason: "AMA discharges require physician review and patient risk acknowledgment documentation" },
      { agent: "Quality Sentinel", task: "Sentinel event escalation", reason: "Serious safety events require immediate executive review and root cause analysis initiation" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Full hospital command center — census, staffing, quality, and supply dashboards" :
        ch.name === "WhatsApp" ? "\"ICU bed 14 is available. Transfer from ER for Mr. Johnson is ready to proceed.\"" :
        ch.name === "Telegram" ? "Real-time bed availability and staffing alerts on the go" :
        ch.name === "Discord" ? "Department coordination channels for charge nurses and house supervisors" :
        ch.name === "Slack" ? "Use /census, /beds, or /staff to pull live hospital data from any channel" :
        ch.name === "Email" ? "Shift handoff summaries, quality reports, and compliance notifications" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("carehub-hospital", "https://carehub-hospital.vercel.app"),
    projectUrl: "https://carehub-hospital.vercel.app",
    stats: [
      { label: "Beds Managed", value: "340" },
      { label: "Avg. Discharge Time", value: "-2.1 hrs" },
      { label: "Staff Utilization", value: "94%" },
      { label: "Patient Satisfaction", value: "4.2/5" },
    ],
  },
};

export default content;
