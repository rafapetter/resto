import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "manufacturing", name: "Manufacturing", emoji: "🏭" },
      { id: "retail", name: "Retail", emoji: "🏬" },
      { id: "food-bev", name: "Food & Beverage", emoji: "🍕" },
      { id: "pharma", name: "Pharmaceuticals", emoji: "💊" },
      { id: "automotive", name: "Automotive", emoji: "🚗" },
      { id: "electronics", name: "Electronics", emoji: "🔌" },
    ],
    verticals: [
      { id: "procurement", name: "Procurement" },
      { id: "inventory-management", name: "Inventory Management" },
      { id: "demand-planning", name: "Demand Planning" },
      { id: "supplier-relations", name: "Supplier Relations" },
    ],
    features: [
      { id: "purchase-orders", name: "Purchase Orders" },
      { id: "inventory-tracking", name: "Inventory Tracking" },
      { id: "demand-forecasting", name: "Demand Forecasting" },
      { id: "supplier-scoring", name: "Supplier Scoring" },
      { id: "quality-control", name: "Quality Control" },
      { id: "warehouse-management", name: "Warehouse Management" },
    ],
    autoSelections: {
      industry: "manufacturing",
      vertical: "procurement",
      features: ["purchase-orders", "inventory-tracking", "demand-forecasting", "supplier-scoring"],
      autonomy: {
        "purchase-orders": "supervised",
        "inventory-tracking": "full",
        "demand-forecasting": "full",
        "supplier-scoring": "full",
        "quality-control": "supervised",
        "warehouse-management": "full",
      },
    },
    projectName: "ChainSync",
    projectDescription: "AI-powered supply chain platform with real-time inventory tracking, predictive demand forecasting, automated procurement workflows, and supplier performance management for end-to-end visibility.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "ChainSync",
    projectBadge: "Supply Chain",
    projectDescription: "Optimize your entire supply chain — from procurement to delivery — with AI-driven demand planning, real-time inventory visibility, and automated supplier management that reduces costs and eliminates stockouts.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Morning briefing: Inventory health across 3 warehouses is at 87% optimal. Two critical alerts this morning — raw aluminum stock at the Dallas DC is down to 4 days of supply (threshold: 7 days), and Supplier #SL-4092 (Pacific Components) missed their delivery window by 36 hours on PO-28417. Demand forecast models updated overnight showing a 22% spike in Q2 orders for the EV motor assembly line.",
      },
      {
        role: "user",
        content: "What's happening with Pacific Components? Pull up their supplier scorecard.",
      },
      {
        role: "assistant",
        content: "Pacific Components (SL-4092) — Tier 2 supplier, precision circuit boards. Current scorecard:\n\n• **On-Time Delivery**: 78% (down from 91% last quarter)\n• **Quality Rate**: 96.3% (within tolerance)\n• **Lead Time Avg**: 14.2 days (contracted: 10 days)\n• **Open POs**: 3 orders worth $284K\n• **Last 5 deliveries**: 2 late, 1 partial shipment, 2 on-time\n\nRoot cause analysis suggests they're capacity-constrained after losing a production line to maintenance. Their account manager confirmed a 3-week recovery timeline. I've identified two pre-qualified alternates — Vertex Electronics (98% OTD, 12-day lead) and NanoCircuit Ltd (94% OTD, 9-day lead) — both can absorb the overflow volume.",
      },
      {
        role: "user",
        content: "Split the next two POs between Vertex and NanoCircuit. Also trigger an emergency restock on aluminum for Dallas.",
      },
      {
        role: "assistant",
        content: "I've prepared the following actions:\n\n**PO Rerouting:**\n• PO-28523 ($142K, 5,000 units) → Vertex Electronics — est. delivery in 12 days\n• PO-28541 ($97K, 3,200 units) → NanoCircuit Ltd — est. delivery in 9 days\n• Pacific Components notified of volume reduction with performance improvement plan\n\n**Emergency Aluminum Restock:**\n• Supplier: Alcoa Direct (preferred vendor, 99.1% OTD)\n• Quantity: 18 metric tons (covers 14 days of supply)\n• Expedited freight via rail + last-mile truck\n• Est. arrival: 3 business days at Dallas DC\n• Cost: $47,200 (12% premium for expedited shipping)\n\nShall I execute both actions?",
        action: {
          type: "approval",
          title: "Reroute POs & Emergency Aluminum Restock",
          description: "Reroute PO-28523 to Vertex Electronics and PO-28541 to NanoCircuit Ltd. Issue emergency purchase order to Alcoa Direct for 18 metric tons of raw aluminum with expedited freight to Dallas DC. Total estimated cost: $286,200.",
        },
      },
      {
        role: "user",
        content: "Approved. Now tell me about the Q2 demand spike — what's driving it?",
      },
      {
        role: "assistant",
        content: "The Q2 demand forecast surge is driven by three converging factors:\n\n1. **OEM Contract Ramp-Up** — Rivian increased their EV motor assembly commitment by 30%, effective April 1. This alone accounts for 14% of the spike.\n2. **Seasonal Pattern** — Historical data shows Q2 manufacturing orders consistently rise 12-18% across automotive components.\n3. **New Product Launch** — The Gen-3 motor controller board enters mass production in May, pulling forward component procurement.\n\n**Impact on current inventory:**\n• Copper wiring: Need to increase safety stock by 40% — current levels cover only 60% of projected Q2 demand\n• PCB assemblies: Adequate if alternate suppliers maintain delivery schedules\n• Rare earth magnets: Single-source risk — recommend qualifying a second supplier within 6 weeks\n\nI've drafted a pre-procurement plan that staggers orders across March to avoid warehouse capacity issues. Want me to share the detailed breakdown?",
      },
      {
        role: "user",
        content: "Yes, share the plan and flag any items that need my approval before ordering.",
      },
      {
        role: "assistant",
        content: "Here's the Q2 pre-procurement plan:\n\n**Wave 1 (March 1-7) — Auto-approved:**\n• Copper wiring: 45 tons from SteelWire Inc. — $312K (within budget authority)\n• Fastener kits: 200K units from BoltMax — $28K (standard restock)\n• Thermal compounds: 500L from ChemFlow — $18K\n\n**Wave 2 (March 10-14) — Requires approval:**\n• PCB assemblies: 25K units split across Vertex + NanoCircuit — $485K (exceeds single-PO threshold)\n• Rare earth magnets: 8 tons from SinoMag — $620K (single-source, geopolitical risk flag)\n\n**Wave 3 (March 20-28) — Requires approval:**\n• Custom motor housings: 12K units from PrecisionCast — $890K (new tooling investment required)\n• Quality inspection equipment upgrade — $145K (CapEx)\n\nTotal pre-procurement budget: $2.49M. Waves 2 and 3 will come to you for sign-off before execution. I've also set up automated reorder triggers for Wave 1 items that will fire on March 1.",
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning. Here's your ChainSync supply chain briefing for February 20th.", durationMs: 3200 },
      { speaker: "agent", text: "Inventory health is at 87% across three distribution centers. Critical alert: raw aluminum at Dallas is down to 4 days of supply — well below the 7-day threshold. An emergency restock from Alcoa Direct is recommended with 3-day expedited delivery. Supplier Pacific Components missed their delivery window by 36 hours on a $142K purchase order. Their on-time rate has dropped to 78% this quarter.", durationMs: 12800 },
      { speaker: "agent", text: "Demand forecast models updated overnight. Q2 orders for the EV motor assembly line are projected to spike 22%, driven by the Rivian contract ramp-up, seasonal patterns, and the Gen-3 controller board launch. A pre-procurement plan totaling $2.49M has been staged in three waves across March.", durationMs: 10200 },
      { speaker: "agent", text: "Warehouse operations update: Dallas DC is at 82% capacity, Chicago at 71%, and Reno at 64%. Two inbound shipments arriving today — one from Alcoa and one from BoltMax. Quality inspection queue has 14 items pending, with 3 flagged for dimensional tolerance review. Overall order accuracy is holding at 99.2% month-to-date.", durationMs: 11400 },
    ],
    summary: "Supply chain briefing covered inventory health at 87%, critical aluminum shortage at Dallas DC, Pacific Components supplier performance decline, Q2 demand spike of 22% for EV assembly, $2.49M pre-procurement plan, and warehouse capacity across three DCs.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "SAP S/4HANA", icon: "database", category: "ERP", description: "Enterprise resource planning with materials management and production planning" },
      { name: "Oracle NetSuite", icon: "layers", category: "ERP", description: "Cloud ERP for procurement, inventory, and financial management" },
      { name: "EDI Gateway", icon: "arrow-left-right", category: "Data Exchange", description: "Electronic data interchange for purchase orders, invoices, and ASNs" },
      { name: "RFID/IoT Sensors", icon: "radio", category: "Warehouse", description: "Real-time asset tracking, temperature monitoring, and inventory scanning" },
      { name: "Kinaxis RapidResponse", icon: "trending-up", category: "Planning", description: "Demand sensing, supply planning, and scenario analysis" },
      { name: "Coupa Procurement", icon: "shopping-cart", category: "Procurement", description: "Spend management, sourcing, and supplier collaboration portal" },
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
      { title: "Design procurement and purchase order data models with approval workflows", stage: "plan", status: "complete" },
      { title: "Map SAP and NetSuite API endpoints for inventory and PO sync", stage: "plan", status: "complete" },
      { title: "Build real-time inventory dashboard with multi-warehouse visibility", stage: "build", status: "complete" },
      { title: "Implement supplier scoring engine with delivery and quality metrics", stage: "build", status: "complete" },
      { title: "Create demand forecasting module with ML-driven predictions", stage: "build", status: "active" },
      { title: "Build automated purchase order generation with approval routing", stage: "build", status: "pending" },
      { title: "Integrate EDI gateway for supplier electronic data interchange", stage: "launch", status: "pending" },
      { title: "Deploy with RFID/IoT sensor connectivity and warehouse monitoring", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "procurement", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[poId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "inventory", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[warehouseId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "suppliers", type: "folder", children: [
                { name: "page.tsx", type: "file" },
                { name: "[supplierId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
              { name: "forecasting", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "quality", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "procurement", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "inventory", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "suppliers", type: "folder", children: [
                { name: "route.ts", type: "file" },
                { name: "score", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "forecasting", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "quality", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "sap", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "edi", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "sap-client.ts", type: "file" },
          { name: "demand-forecaster.ts", type: "file" },
          { name: "supplier-scorer.ts", type: "file" },
          { name: "inventory-optimizer.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Procurement Policies", icon: "file-text", count: 32 },
      { name: "Supplier SLAs", icon: "handshake", count: 45 },
      { name: "Quality Standards", icon: "shield-check", count: 28 },
      { name: "Logistics Guides", icon: "truck", count: 19 },
      { name: "Compliance & Regulatory", icon: "scale", count: 24 },
    ],
    documents: [
      { title: "Master Procurement Policy Handbook", category: "Procurement Policies", tier: "index", lines: 140, crossRefs: ["PO Approval Threshold Matrix", "Supplier Onboarding Checklist"] },
      { title: "PO Approval Threshold Matrix", category: "Procurement Policies", tier: "detail", lines: 85 },
      { title: "Supplier Onboarding Checklist", category: "Supplier SLAs", tier: "summary", lines: 120, crossRefs: ["Supplier Performance Scorecard Methodology"] },
      { title: "Supplier Performance Scorecard Methodology", category: "Supplier SLAs", tier: "detail", lines: 310 },
      { title: "ISO 9001 Quality Management Procedures", category: "Quality Standards", tier: "detail", lines: 480, crossRefs: ["Incoming Inspection Protocol"] },
      { title: "Incoming Inspection Protocol", category: "Quality Standards", tier: "summary", lines: 165 },
      { title: "Warehouse Receiving & Putaway Guide", category: "Logistics Guides", tier: "detail", lines: 240, crossRefs: ["RFID Tag Scanning Procedures"] },
      { title: "RFID Tag Scanning Procedures", category: "Logistics Guides", tier: "detail", lines: 175 },
      { title: "Hazardous Materials Handling & Compliance", category: "Compliance & Regulatory", tier: "summary", lines: 290, crossRefs: ["ISO 9001 Quality Management Procedures"] },
      { title: "Customs & Import Documentation Guide", category: "Compliance & Regulatory", tier: "detail", lines: 360 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Inventory Turnover (times/month)",
        type: "bar",
        data: [
          { name: "Sep", value: 4.2 },
          { name: "Oct", value: 4.5 },
          { name: "Nov", value: 4.8 },
          { name: "Dec", value: 3.9 },
          { name: "Jan", value: 5.1 },
          { name: "Feb", value: 5.4 },
        ],
      },
      {
        label: "Order Fulfillment Rate (%)",
        type: "line",
        data: [
          { name: "Sep", value: 96.8 },
          { name: "Oct", value: 97.2 },
          { name: "Nov", value: 97.9 },
          { name: "Dec", value: 96.1 },
          { name: "Jan", value: 98.4 },
          { name: "Feb", value: 99.2 },
        ],
      },
    ],
    agents: [
      { name: "Supply Chain Director", role: "Orchestrates end-to-end supply chain operations and strategic planning", avatar: "🔗", color: "blue", tasks: ["Supply chain oversight", "Risk mitigation", "Cross-functional coordination"] },
      { name: "Procurement Agent", role: "Manages purchase orders, vendor selection, and spend optimization", avatar: "📋", color: "emerald", tasks: ["PO generation", "Vendor evaluation", "Contract negotiation"], reportsTo: "Supply Chain Director" },
      { name: "Inventory Manager", role: "Monitors stock levels, reorder points, and warehouse utilization", avatar: "📦", color: "violet", tasks: ["Stock monitoring", "Reorder triggers", "Safety stock optimization"], reportsTo: "Supply Chain Director" },
      { name: "Demand Planner", role: "Forecasts demand using ML models and market signals", avatar: "📈", color: "amber", tasks: ["Demand forecasting", "Seasonality analysis", "Promotional impact modeling"], reportsTo: "Supply Chain Director" },
      { name: "Quality Inspector", role: "Enforces quality standards and manages inspection workflows", avatar: "🔍", color: "rose", tasks: ["Incoming inspections", "Defect tracking", "Supplier quality audits"], reportsTo: "Supply Chain Director" },
      { name: "Logistics Coordinator", role: "Optimizes shipping routes, carrier selection, and delivery tracking", avatar: "🚚", color: "cyan", tasks: ["Route optimization", "Carrier management", "Shipment tracking"], reportsTo: "Inventory Manager" },
      { name: "Supplier Relations", role: "Maintains supplier scorecards, SLAs, and relationship management", avatar: "🤝", color: "green", tasks: ["Scorecard updates", "SLA monitoring", "Performance reviews"], reportsTo: "Procurement Agent" },
    ],
    humanReviewPoints: [
      { agent: "Procurement Agent", task: "Purchase orders exceeding $500K", reason: "High-value procurement requires VP of Operations sign-off and finance team budget verification" },
      { agent: "Quality Inspector", task: "Batch rejection above 5% threshold", reason: "Rejecting a supplier batch triggers contractual SLA penalties and requires supply chain director review" },
      { agent: "Demand Planner", task: "Forecast override exceeding 25% variance", reason: "Large forecast adjustments impact procurement commitments and warehouse capacity planning across the network" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Full supply chain dashboard — inventory, procurement, suppliers, and demand forecasts" :
        ch.name === "WhatsApp" ? "\"Alert: Raw aluminum at Dallas DC dropped below safety stock. Emergency PO recommended.\"" :
        ch.name === "Telegram" ? "Real-time shipment tracking, inventory alerts, and supplier delivery updates" :
        ch.name === "Discord" ? "Supply chain ops room — coordinate procurement, logistics, and quality escalations" :
        ch.name === "Slack" ? "Use /inventory, /suppliers, or /orders for instant supply chain data" :
        ch.name === "Email" ? "Daily inventory digest, supplier scorecards, and weekly demand forecast reports" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("chainsync", "https://chainsync.vercel.app"),
    projectUrl: "https://chainsync.vercel.app",
    stats: [
      { label: "SKUs Managed", value: "45,000+" },
      { label: "Order Accuracy", value: "99.2%" },
      { label: "Lead Time Reduction", value: "35%" },
      { label: "Cost Savings", value: "18%" },
    ],
  },
};

export default content;
