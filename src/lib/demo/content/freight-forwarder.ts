import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "freight-forwarding", name: "Freight Forwarding", emoji: "🚢" },
      { id: "ocean-freight", name: "Ocean Freight", emoji: "🌊" },
      { id: "air-cargo", name: "Air Cargo", emoji: "✈️" },
      { id: "customs-brokerage", name: "Customs Brokerage", emoji: "🛃" },
      { id: "warehousing", name: "Warehousing", emoji: "🏭" },
      { id: "intermodal-transport", name: "Intermodal Transport", emoji: "🚛" },
    ],
    verticals: [
      { id: "shipment-tracking", name: "Shipment Tracking" },
      { id: "customs-compliance", name: "Customs Compliance" },
      { id: "rate-management", name: "Rate Management" },
      { id: "warehouse-operations", name: "Warehouse Operations" },
    ],
    features: [
      { id: "bol-awb-generation", name: "BOL/AWB Generation" },
      { id: "container-tracking", name: "Container Tracking" },
      { id: "customs-declaration", name: "Customs Declaration" },
      { id: "rate-quoting", name: "Rate Quoting" },
      { id: "document-management", name: "Document Management" },
      { id: "cargo-insurance", name: "Cargo Insurance" },
    ],
    autoSelections: {
      industry: "freight-forwarding",
      vertical: "shipment-tracking",
      features: ["bol-awb-generation", "container-tracking", "customs-declaration", "rate-quoting"],
      autonomy: {
        "bol-awb-generation": "full",
        "container-tracking": "full",
        "customs-declaration": "supervised",
        "rate-quoting": "supervised",
        "document-management": "full",
        "cargo-insurance": "supervised",
      },
    },
    projectName: "CargoFlow Global",
    projectDescription: "AI-powered freight forwarding platform with real-time container tracking, automated customs declarations, and intelligent rate optimization across ocean, air, and intermodal lanes.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "CargoFlow Global",
    projectBadge: "Freight Forwarding",
    projectDescription: "Orchestrate global shipments with AI-driven container tracking, automated customs filings, dynamic rate quoting, and end-to-end document management.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Good morning. You have 47 active shipments in transit today. Container MSCU-7294810 on the Maersk Valencia is currently held at Long Beach — customs has flagged an HTS classification discrepancy on the ceramics consignment. Two booking confirmations are pending your review, and Nakamura Trading is requesting a rate quote for 3x40HC Shanghai to Rotterdam.",
      },
      {
        role: "user",
        content: "What's the issue with the ceramics container? And what's the current ETA on the Maersk Valencia?",
      },
      {
        role: "assistant",
        content: "Container MSCU-7294810 — the CBP system flagged HTS code 6911.10 (porcelain tableware) but the commercial invoice lists the goods as \"decorative ceramic tiles,\" which should fall under 6907.40. The duty rate difference is 4.5% vs 8.7%. The original shipper in Foshan likely used the wrong classification. The Maersk Valencia arrived at Long Beach on Feb 18 but the container won't be released until the classification is corrected. I can prepare an amended entry with the correct HTS code and supporting product specs. Want me to proceed?",
      },
      {
        role: "user",
        content: "Yes, file the amendment. Also, what about Nakamura's rate request? Give me the best options for Shanghai to Rotterdam, 3x40HC, sailing within the next 10 days.",
      },
      {
        role: "assistant",
        content: "I'm preparing the amended customs entry now. For Nakamura Trading's Shanghai-Rotterdam lane, here are the top 3 options:\n\n1. **MSC Isabella** — ETD Feb 24, ETA Mar 28 (32 days). Rate: $2,180/40HC. Via Tanjung Pelepas.\n2. **CMA CGM Marco Polo** — ETD Feb 26, ETA Mar 26 (28 days). Rate: $2,450/40HC. Direct service.\n3. **Evergreen Triton** — ETD Mar 1, ETA Apr 2 (32 days). Rate: $1,920/40HC. Via Colombo.\n\nThe CMA CGM direct service saves 4 transit days but costs $810 more across 3 containers. Based on Nakamura's usual preference for speed, I'd recommend option 2. Shall I send the quote and lock in the booking?",
      },
      {
        role: "user",
        content: "Go with CMA CGM. Send the quote to Nakamura and draft the booking confirmation. Also make sure the BOL is prepped once they confirm.",
      },
      {
        role: "assistant",
        content: "Done. I've sent the rate quote to Nakamura Trading at hiroshi.tanaka@nakamura-trading.co.jp with the CMA CGM Marco Polo details. Booking reference CMQ-2026-88412 is held until Feb 22 pending their confirmation. I've pre-populated the Bill of Lading template with shipper/consignee details, container specs, and the Shanghai Yangshan terminal cutoff (Feb 25, 16:00 CST). One more item — the cargo insurance certificate for the Apex Industries shipment on voyage HMM-4471 expires tomorrow. The policy needs renewal before the vessel reaches Busan.",
        action: {
          type: "approval",
          title: "Renew Cargo Insurance Policy",
          description: "Renew marine cargo insurance for Apex Industries shipment (HMM-4471, 2x20GP, auto parts valued at $184,000). Current policy with TK Marine Underwriters expires Feb 21. Renewal premium: $1,380. Coverage: ICC(A) all-risk, warehouse-to-warehouse.",
        },
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning. Here's your freight operations briefing for today, February 20th.", durationMs: 3200 },
      { speaker: "agent", text: "You have 47 shipments in transit across 12 ocean carriers and 3 air cargo operators. Six containers are expected at Long Beach today, with two requiring same-day customs clearance. The Maersk Valencia shipment is on customs hold due to an HTS classification issue — I've prepared an amended entry for your review.", durationMs: 9800 },
      { speaker: "agent", text: "Three booking requests came in overnight: Nakamura Trading needs 3x40HC Shanghai to Rotterdam, GlobalTech wants air freight for 2 pallets of server equipment Shenzhen to Chicago O'Hare, and Meridian Foods has a reefer container of frozen seafood from Oslo to Yokohama. I've compiled rate options for each.", durationMs: 10200 },
      { speaker: "agent", text: "Administrative items: four Bills of Lading are pending your signature, the Apex Industries cargo insurance expires tomorrow and needs renewal, and your quarterly CTPAT compliance audit is due by end of month. Shall I prioritize the customs amendment first?", durationMs: 9400 },
    ],
    summary: "Morning briefing covered 47 active shipments, customs hold on MSCU-7294810 requiring HTS amendment, 3 overnight booking requests (ocean and air), 4 pending BOLs, an expiring cargo insurance policy, and an upcoming CTPAT compliance audit.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "CargoWise One", icon: "ship", category: "TMS", description: "End-to-end freight management, customs entries, and accounting integration" },
      { name: "Flexport API", icon: "package", category: "Logistics", description: "Digital freight booking, tracking, and supply chain visibility" },
      { name: "AES/ABI Direct", icon: "shield-check", category: "Customs", description: "Electronic customs filing for export declarations and import entries" },
      { name: "MarineTraffic", icon: "navigation", category: "Tracking", description: "Real-time vessel AIS tracking, port calls, and ETA predictions" },
      { name: "Port Community System", icon: "building-2", category: "Port Ops", description: "Terminal appointments, container availability, and gate transactions" },
      { name: "INTTRA / CargoSmart", icon: "globe", category: "Ocean", description: "Carrier booking, shipping instructions, and ocean bill of lading management" },
      COMMON_INTEGRATIONS.googleEmail,
      COMMON_INTEGRATIONS.calendar,
      COMMON_INTEGRATIONS.slack,
      COMMON_INTEGRATIONS.stripe,
      COMMON_INTEGRATIONS.github,
      COMMON_INTEGRATIONS.vercel,
      COMMON_INTEGRATIONS.sentry,
      COMMON_INTEGRATIONS.analytics,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: "Define shipment data schema & multi-modal transport model", stage: "plan", status: "complete" },
      { title: "Map carrier API integrations (ocean, air, ground)", stage: "plan", status: "complete" },
      { title: "Build container tracking engine with AIS & milestone events", stage: "build", status: "complete" },
      { title: "Implement customs declaration workflow with AES/ABI filing", stage: "build", status: "complete" },
      { title: "Create rate management system with dynamic quoting", stage: "build", status: "active" },
      { title: "Build document generation pipeline (BOL, AWB, packing lists)", stage: "build", status: "pending" },
      { title: "Configure role-based access & audit trail logging", stage: "launch", status: "pending" },
      { title: "Deploy with carrier sandbox testing and go-live validation", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "shipments", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[shipmentId]", type: "folder", children: [
                  { name: "page.tsx", type: "file" },
                  { name: "tracking.tsx", type: "file" },
                  { name: "documents.tsx", type: "file" },
                ] },
              ] },
              { name: "bookings", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "customs", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "rates", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "warehouse", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "shipments", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "bookings", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "customs", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "tracking", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "rates", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "documents", type: "folder", children: [
                { name: "bol", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "awb", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "webhooks", type: "folder", children: [
                { name: "carrier-events", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "customs-status", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "port-updates", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
          { name: "portal", type: "folder", children: [
            { name: "page.tsx", type: "file" },
            { name: "track", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            { name: "quotes", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          ] },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "carrier-client.ts", type: "file" },
          { name: "customs-filing.ts", type: "file" },
          { name: "ais-tracker.ts", type: "file" },
          { name: "rate-engine.ts", type: "file" },
          { name: "document-gen.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Incoterms & Trade Rules", icon: "scale", count: 22 },
      { name: "Customs Regulations", icon: "shield", count: 38 },
      { name: "Tariff Classifications", icon: "file-text", count: 45 },
      { name: "Carrier Agreements", icon: "handshake", count: 28 },
      { name: "Dangerous Goods Regs", icon: "alert-triangle", count: 16 },
    ],
    documents: [
      { title: "Incoterms 2020 Complete Guide", category: "Incoterms & Trade Rules", tier: "index", lines: 120, crossRefs: ["FOB vs CIF Decision Matrix", "Carrier Liability by Incoterm"] },
      { title: "FOB vs CIF Decision Matrix", category: "Incoterms & Trade Rules", tier: "detail", lines: 280 },
      { title: "Carrier Liability by Incoterm", category: "Incoterms & Trade Rules", tier: "detail", lines: 195 },
      { title: "US Customs Entry Procedures (CBP)", category: "Customs Regulations", tier: "summary", lines: 210, crossRefs: ["HTS Classification Handbook", "AES Filing Requirements"] },
      { title: "HTS Classification Handbook", category: "Tariff Classifications", tier: "index", lines: 150, crossRefs: ["Duty Rate Schedule 2026", "Anti-Dumping & CVD Orders"] },
      { title: "Duty Rate Schedule 2026", category: "Tariff Classifications", tier: "detail", lines: 920 },
      { title: "Anti-Dumping & CVD Orders", category: "Tariff Classifications", tier: "detail", lines: 480 },
      { title: "AES Filing Requirements", category: "Customs Regulations", tier: "detail", lines: 310 },
      { title: "IMDG Code Summary — Dangerous Goods by Sea", category: "Dangerous Goods Regs", tier: "summary", lines: 260, crossRefs: ["IATA DGR Air Cargo Provisions"] },
      { title: "IATA DGR Air Cargo Provisions", category: "Dangerous Goods Regs", tier: "detail", lines: 340 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Shipment Volume (Last 6 Months)",
        type: "bar",
        data: [
          { name: "Sep", value: 1842 },
          { name: "Oct", value: 2105 },
          { name: "Nov", value: 2380 },
          { name: "Dec", value: 1965 },
          { name: "Jan", value: 2240 },
          { name: "Feb", value: 2468 },
        ],
      },
      {
        label: "On-Time Delivery Rate (%)",
        type: "line",
        data: [
          { name: "Sep", value: 88 },
          { name: "Oct", value: 91 },
          { name: "Nov", value: 89 },
          { name: "Dec", value: 93 },
          { name: "Jan", value: 95 },
          { name: "Feb", value: 96 },
        ],
      },
    ],
    agents: [
      { name: "Operations Manager", role: "Orchestrates end-to-end freight operations and shipment lifecycle", avatar: "🚢", color: "blue", tasks: ["Shipment prioritization", "Exception management", "Carrier coordination"] },
      { name: "Booking Agent", role: "Manages carrier bookings, space allocation, and sailing schedules", avatar: "📋", color: "emerald", tasks: ["Booking confirmation", "Space allocation", "Schedule optimization"], reportsTo: "Operations Manager" },
      { name: "Customs Agent", role: "Handles customs declarations, HTS classification, and regulatory compliance", avatar: "🛃", color: "violet", tasks: ["Entry filing", "HTS classification", "Duty calculation"], reportsTo: "Operations Manager" },
      { name: "Tracking Agent", role: "Monitors real-time container and cargo positions across all modes", avatar: "📡", color: "amber", tasks: ["AIS vessel tracking", "Milestone updates", "ETA prediction"], reportsTo: "Operations Manager" },
      { name: "Document Agent", role: "Generates and manages shipping documents — BOL, AWB, packing lists, COO", avatar: "📄", color: "rose", tasks: ["BOL generation", "AWB preparation", "Document validation"], reportsTo: "Operations Manager" },
      { name: "Rate Optimizer", role: "Analyzes carrier rates, negotiates contracts, and optimizes lane costs", avatar: "💹", color: "cyan", tasks: ["Rate benchmarking", "Contract negotiation", "Lane cost analysis"], reportsTo: "Operations Manager" },
      { name: "Customer Liaison", role: "Manages shipper and consignee communications and status updates", avatar: "🤝", color: "green", tasks: ["Status notifications", "Quote delivery", "Exception alerts"], reportsTo: "Booking Agent" },
    ],
    humanReviewPoints: [
      { agent: "Customs Agent", task: "Amended customs entry for HTS reclassification", reason: "Tariff classification changes affect duty liability and require licensed customs broker sign-off" },
      { agent: "Rate Optimizer", task: "Carrier contract rate negotiation above threshold", reason: "Rate commitments exceeding $50,000 annual volume require management approval" },
      { agent: "Document Agent", task: "Bill of Lading release for high-value cargo", reason: "Original BOL surrender for shipments over $200,000 requires verified authorization to prevent fraud" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Track shipments, manage bookings, file customs entries, and view rate analytics" :
        ch.name === "WhatsApp" ? "\"Container MSCU-7294810 cleared customs at Long Beach. ETA to warehouse: Feb 22, 10:00 AM.\"" :
        ch.name === "Telegram" ? "Quick container tracking lookups and shipment milestone alerts" :
        ch.name === "Discord" ? "Operations team coordination — discuss bookings, customs holds, and carrier updates" :
        ch.name === "Slack" ? "Use /track, /book, or /rates to manage freight operations from Slack" :
        ch.name === "Email" ? "Daily shipment digest, customs clearance alerts, and booking confirmations" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("cargoflow-global", "https://cargoflow-global.vercel.app"),
    projectUrl: "https://cargoflow-global.vercel.app",
    stats: [
      { label: "Shipments Tracked", value: "12,000+" },
      { label: "Customs Clearance", value: "98%" },
      { label: "Avg Transit Savings", value: "22%" },
      { label: "Document Accuracy", value: "99.5%" },
    ],
  },
};

export default content;
