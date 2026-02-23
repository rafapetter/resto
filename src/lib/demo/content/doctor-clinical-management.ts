import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "healthcare", name: "Healthcare", emoji: "🏥" },
      { id: "telemedicine", name: "Telemedicine", emoji: "📱" },
      { id: "dental", name: "Dental Practice", emoji: "🦷" },
      { id: "dermatology", name: "Dermatology", emoji: "🔬" },
      { id: "pediatrics", name: "Pediatrics", emoji: "👶" },
      { id: "mental-health", name: "Mental Health", emoji: "🧠" },
    ],
    verticals: [
      { id: "patient-management", name: "Patient Management" },
      { id: "clinical-workflows", name: "Clinical Workflows" },
      { id: "billing-insurance", name: "Billing & Insurance" },
      { id: "telehealth", name: "Telehealth Platform" },
    ],
    features: [
      { id: "ehr-integration", name: "EHR Integration" },
      { id: "appointment-scheduling", name: "Appointment Scheduling" },
      { id: "prescription-management", name: "Prescription Management" },
      { id: "patient-portal", name: "Patient Portal" },
      { id: "lab-results", name: "Lab Results Tracking" },
      { id: "hipaa-compliance", name: "HIPAA Compliance" },
    ],
    autoSelections: {
      industry: "healthcare",
      vertical: "clinical-workflows",
      features: ["ehr-integration", "appointment-scheduling", "prescription-management", "hipaa-compliance"],
      autonomy: {
        "appointment-scheduling": "full",
        "prescription-management": "supervised",
        "patient-portal": "full",
        "lab-results": "supervised",
        "ehr-integration": "supervised",
        "hipaa-compliance": "full",
      },
    },
    projectName: "MedFlow Clinic",
    projectDescription: "AI-powered clinical management system with EHR integration, smart scheduling, and HIPAA-compliant patient workflows.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "MedFlow Clinic",
    projectBadge: "Healthcare",
    projectDescription: "Streamline clinical operations with AI-driven patient scheduling, automated prescription refills, and intelligent triage routing.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Good morning, Dr. Patel. You have 23 patients scheduled today. I've flagged 3 patients with overdue lab panels and 1 prior-auth request pending for Mrs. Tanaka's MRI.",
      },
      {
        role: "user",
        content: "Pull up Mrs. Tanaka's chart and check if the prior-auth was submitted to Blue Cross.",
      },
      {
        role: "assistant",
        content: "Mrs. Tanaka (DOB 04/15/1968) — the prior-auth for her lumbar MRI was submitted on Feb 14. Blue Cross acknowledged receipt but status is still \"Under Review.\" Her last visit note mentions chronic lower back pain with radiculopathy, L4-L5. Would you like me to call the payer line for an expedited review?",
      },
      {
        role: "user",
        content: "Yes, escalate that. Also, reschedule the 2:30 follow-up with Mr. Davis to next Thursday — he called saying he has a conflict.",
      },
      {
        role: "assistant",
        content: "I've initiated the payer escalation call for Mrs. Tanaka's prior-auth. For Mr. Davis, next Thursday at 2:30 PM is available. I'll send him a confirmation via the patient portal and SMS. I also noticed his A1C results came back at 7.2% — slightly above target. Should I add a diabetes management discussion to his visit agenda?",
      },
      {
        role: "user",
        content: "Good catch. Yes, flag that for discussion and prep the latest ADA guidelines summary.",
      },
      {
        role: "assistant",
        content: "Done. I've attached the 2025 ADA Standards of Care summary to Mr. Davis's chart and flagged the A1C trend (was 6.9% three months ago). One more item — Dr. Kim's referral for patient James Ortiz needs your co-signature on the cardiology consult note before end of day.",
        action: {
          type: "approval",
          title: "Co-sign Cardiology Consult",
          description: "Review and co-sign the cardiology referral note for James Ortiz (DOB 11/03/1955). Referred for evaluation of exercise-induced chest tightness with borderline stress test.",
        },
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning, Dr. Patel. Here's your clinical briefing for today, February 20th.", durationMs: 3200 },
      { speaker: "agent", text: "You have 23 appointments across three exam rooms. Your first patient is at 8:15 AM — Maria Santos, a 42-year-old presenting for her annual wellness visit. Her lipid panel from last week shows elevated LDL at 162. No medication changes since her last visit.", durationMs: 8500 },
      { speaker: "agent", text: "Three patients flagged as urgent: Mrs. Tanaka still awaiting MRI prior-auth, Mr. Chen has an abnormal ECG that needs review, and baby Avery Thompson's newborn screening results require follow-up. I've prioritized these at the top of your task queue.", durationMs: 9200 },
      { speaker: "agent", text: "Administrative items: two prescription refill requests are ready for your approval, the monthly quality metrics report is due Friday, and your CME credits for Q1 need 4 more hours. Shall I schedule a block for those this week?", durationMs: 8800 },
    ],
    summary: "Morning briefing covered 23 scheduled patients, 3 urgent flags (pending prior-auth, abnormal ECG, newborn screening), 2 refill requests, and upcoming administrative deadlines.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Epic EHR", icon: "heart-pulse", category: "Clinical", description: "Full EHR integration for patient charts, orders, and clinical documentation" },
      { name: "Surescripts", icon: "pill", category: "Pharmacy", description: "E-prescribing network for medication orders and refill management" },
      { name: "Lab Corp Portal", icon: "flask-conical", category: "Diagnostics", description: "Lab order submission, result retrieval, and abnormal value alerts" },
      { name: "Availity", icon: "shield-check", category: "Insurance", description: "Real-time eligibility verification and prior-authorization workflows" },
      { name: "Doxy.me", icon: "video", category: "Telehealth", description: "HIPAA-compliant video consultations embedded in patient workflows" },
      { name: "DrChrono", icon: "clipboard-list", category: "Practice Mgmt", description: "Scheduling, billing, and practice analytics dashboard" },
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
      { title: "Define patient data schema & HIPAA compliance layer", stage: "plan", status: "complete" },
      { title: "Map EHR integration endpoints (Epic FHIR R4)", stage: "plan", status: "complete" },
      { title: "Build appointment scheduling engine with conflict detection", stage: "build", status: "complete" },
      { title: "Implement e-prescribing workflow with Surescripts", stage: "build", status: "complete" },
      { title: "Create patient portal with secure messaging", stage: "build", status: "active" },
      { title: "Build lab results dashboard with trend visualization", stage: "build", status: "pending" },
      { title: "Configure HIPAA-compliant audit logging", stage: "launch", status: "pending" },
      { title: "Deploy with BAA-covered hosting and penetration testing", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "patients", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[patientId]", type: "folder", children: [
                  { name: "page.tsx", type: "file" },
                  { name: "chart.tsx", type: "file" },
                ] },
              ] },
              { name: "schedule", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "prescriptions", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "lab-results", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "patients", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "appointments", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "prescriptions", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "ehr", type: "folder", children: [{ name: "fhir", type: "folder", children: [{ name: "route.ts", type: "file" }] }] },
              { name: "webhooks", type: "folder", children: [
                { name: "lab-results", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "insurance", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
          { name: "portal", type: "folder", children: [
            { name: "page.tsx", type: "file" },
            { name: "messages", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          ] },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "fhir-client.ts", type: "file" },
          { name: "hipaa-audit.ts", type: "file" },
          { name: "surescripts.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Clinical Protocols", icon: "stethoscope", count: 24 },
      { name: "HIPAA & Compliance", icon: "shield", count: 18 },
      { name: "Insurance Policies", icon: "file-text", count: 31 },
      { name: "Drug Formularies", icon: "pill", count: 42 },
      { name: "Patient Education", icon: "book-open", count: 15 },
    ],
    documents: [
      { title: "HIPAA Privacy Rule Summary", category: "HIPAA & Compliance", tier: "index", lines: 85, crossRefs: ["BAA Requirements Checklist", "Audit Logging Standards"] },
      { title: "BAA Requirements Checklist", category: "HIPAA & Compliance", tier: "detail", lines: 340 },
      { title: "Audit Logging Standards", category: "HIPAA & Compliance", tier: "detail", lines: 210 },
      { title: "Type 2 Diabetes Management Protocol", category: "Clinical Protocols", tier: "summary", lines: 180, crossRefs: ["ADA 2025 Standards of Care", "Insulin Titration Guidelines"] },
      { title: "ADA 2025 Standards of Care", category: "Clinical Protocols", tier: "detail", lines: 520 },
      { title: "Insulin Titration Guidelines", category: "Clinical Protocols", tier: "detail", lines: 275 },
      { title: "Blue Cross Prior-Auth Requirements", category: "Insurance Policies", tier: "summary", lines: 160, crossRefs: ["CPT Code Reference 2025"] },
      { title: "CPT Code Reference 2025", category: "Insurance Policies", tier: "detail", lines: 890 },
      { title: "Common Drug Interactions Reference", category: "Drug Formularies", tier: "index", lines: 120, crossRefs: ["Type 2 Diabetes Management Protocol"] },
      { title: "Patient Discharge Instructions Template", category: "Patient Education", tier: "summary", lines: 95 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Patient Volume (Last 6 Months)",
        type: "bar",
        data: [
          { name: "Sep", value: 412 },
          { name: "Oct", value: 438 },
          { name: "Nov", value: 395 },
          { name: "Dec", value: 362 },
          { name: "Jan", value: 451 },
          { name: "Feb", value: 467 },
        ],
      },
      {
        label: "Average Wait Time (minutes)",
        type: "line",
        data: [
          { name: "Sep", value: 22 },
          { name: "Oct", value: 19 },
          { name: "Nov", value: 17 },
          { name: "Dec", value: 15 },
          { name: "Jan", value: 13 },
          { name: "Feb", value: 11 },
        ],
      },
    ],
    agents: [
      { name: "Clinical Coordinator", role: "Orchestrates patient flow and clinical workflows", avatar: "🩺", color: "blue", tasks: ["Patient triage routing", "Schedule optimization", "Care gap identification"] },
      { name: "Scheduling Agent", role: "Manages appointments and provider calendars", avatar: "📅", color: "emerald", tasks: ["Appointment booking", "Conflict resolution", "Reminder dispatch"], reportsTo: "Clinical Coordinator" },
      { name: "Rx Manager", role: "Handles prescriptions, refills, and drug interactions", avatar: "💊", color: "violet", tasks: ["Refill processing", "Interaction checking", "Prior-auth for medications"], reportsTo: "Clinical Coordinator" },
      { name: "Insurance Agent", role: "Verifies eligibility and manages prior-authorizations", avatar: "🛡️", color: "amber", tasks: ["Eligibility verification", "Prior-auth submission", "Claim status tracking"], reportsTo: "Clinical Coordinator" },
      { name: "Lab Analyst", role: "Tracks lab orders and flags abnormal results", avatar: "🔬", color: "rose", tasks: ["Order tracking", "Critical value alerts", "Trend analysis"], reportsTo: "Clinical Coordinator" },
      { name: "Patient Comms", role: "Manages patient-facing communications", avatar: "💬", color: "cyan", tasks: ["Portal messages", "SMS reminders", "Post-visit summaries"], reportsTo: "Scheduling Agent" },
      { name: "Compliance Monitor", role: "Ensures HIPAA and regulatory compliance", avatar: "📋", color: "slate", tasks: ["Audit log review", "Access control monitoring", "Incident reporting"], reportsTo: "Clinical Coordinator" },
      { name: "Billing Agent", role: "Processes claims and manages revenue cycle", avatar: "💰", color: "green", tasks: ["Claim submission", "Denial management", "Payment posting"], reportsTo: "Insurance Agent" },
    ],
    humanReviewPoints: [
      { agent: "Rx Manager", task: "Prescription approval for controlled substances", reason: "DEA regulations require physician sign-off on all Schedule II-V prescriptions" },
      { agent: "Insurance Agent", task: "Prior-auth clinical justification", reason: "Clinical narrative must be reviewed by provider before payer submission" },
      { agent: "Lab Analyst", task: "Critical lab value escalation", reason: "Abnormal critical values require immediate physician notification and clinical decision" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Access patient charts, scheduling, lab results, and clinical dashboards" :
        ch.name === "WhatsApp" ? "\"Dr. Patel, Mrs. Tanaka's MRI prior-auth was approved. Shall I schedule her?\"" :
        ch.name === "Telegram" ? "Quick view of today's patient schedule and urgent flags" :
        ch.name === "Discord" ? "Clinical team coordination — discuss cases and share updates" :
        ch.name === "Slack" ? "Use /schedule, /labs, or /rx to manage clinical tasks from Slack" :
        ch.name === "Email" ? "Daily patient panel summary, pending tasks, and compliance alerts" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("medflow-clinic", "https://medflow-clinic.vercel.app"),
    projectUrl: "https://medflow-clinic.vercel.app",
    stats: [
      { label: "Patients Managed", value: "2,400+" },
      { label: "Avg. Wait Reduction", value: "48%" },
      { label: "Claims Auto-Filed", value: "92%" },
      { label: "HIPAA Compliance", value: "100%" },
    ],
  },
};

export default content;
