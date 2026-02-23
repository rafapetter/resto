import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "residential-sales", name: "Residential Sales", emoji: "🏠" },
      { id: "commercial-real-estate", name: "Commercial Real Estate", emoji: "🏢" },
      { id: "property-management", name: "Property Management", emoji: "🔑" },
      { id: "real-estate-development", name: "Real Estate Development", emoji: "🏗️" },
      { id: "luxury-real-estate", name: "Luxury Real Estate", emoji: "🏰" },
      { id: "reits", name: "REITs", emoji: "📊" },
    ],
    verticals: [
      { id: "listing-management", name: "Listing Management" },
      { id: "client-relations", name: "Client Relations" },
      { id: "transaction-management", name: "Transaction Management" },
      { id: "market-analysis", name: "Market Analysis" },
    ],
    features: [
      { id: "mls-integration", name: "MLS Integration" },
      { id: "virtual-tours", name: "Virtual Tours" },
      { id: "lead-scoring", name: "Lead Scoring" },
      { id: "transaction-pipeline", name: "Transaction Pipeline" },
      { id: "commission-tracking", name: "Commission Tracking" },
      { id: "market-reports", name: "Market Reports" },
    ],
    autoSelections: {
      industry: "residential-sales",
      vertical: "listing-management",
      features: ["mls-integration", "lead-scoring", "transaction-pipeline", "market-reports"],
      autonomy: {
        "mls-integration": "full",
        "virtual-tours": "full",
        "lead-scoring": "full",
        "transaction-pipeline": "supervised",
        "commission-tracking": "full",
        "market-reports": "full",
      },
    },
    projectName: "PropelEstate",
    projectDescription: "AI-powered real estate platform with MLS integration, automated lead scoring, virtual tour management, and transaction pipeline tracking for high-performing brokerages.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "PropelEstate",
    projectBadge: "Real Estate",
    projectDescription: "Close more deals and delight clients — intelligent listing management, automated showing coordination, market-driven pricing, and end-to-end transaction tracking from first contact to closing day.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Good morning. Here's your PropelEstate briefing: 12 new leads came in overnight — 4 scored above 80 and are ready for immediate outreach. You have 5 showings scheduled today, starting with the Maple Ridge property at 10 AM. The Thompson offer on 42 Elm Street ($485K) received a counter from the seller at $498K — response deadline is 5 PM today. Also, the Willow Park listing just hit 30 days on market — I've prepared a price adjustment analysis.",
      },
      {
        role: "user",
        content: "Show me the details on the Thompson offer and the new leads.",
      },
      {
        role: "assistant",
        content: "**Thompson Offer — 42 Elm Street:**\n• **Buyer:** Mark & Lisa Thompson (pre-approved, $520K limit)\n• **Original offer:** $485,000 with 20% down, 30-day close\n• **Seller counter:** $498,000, seller covers $5K in closing costs\n• **Comparable analysis:** Neighborhood median is $492K. Two similar homes closed at $489K and $501K last month.\n• **Recommendation:** Counter at $493K — meets in the middle and aligns with comps. Thompsons have room in their budget.\n\n**Top New Leads (Score 80+):**\n1. **Sarah Kim** (Score: 94) — Searching $600-750K, 4BR in Westfield. Pre-approved. Relocated from Chicago, urgent timeline.\n2. **David Ortega** (Score: 88) — First-time buyer, $350-400K range, interested in the Oakdale subdivision.\n3. **Rachel & Tom Hughes** (Score: 85) — Downsizing from 5BR, looking for luxury condos $500-650K.\n4. **James Park** (Score: 82) — Investor, looking for multi-family properties under $800K, cash buyer.\n\nShall I draft the counter-offer for the Thompsons and assign agents to the new leads?",
        action: {
          type: "approval",
          title: "Submit Counter-Offer & Route Leads",
          description: "Submit counter-offer of $493,000 for 42 Elm Street via DocuSign to the seller's agent (keeping $5K closing cost credit). Route Sarah Kim to luxury specialist, David Ortega to buyer's agent, Hughes to condo team, and James Park to investment division.",
        },
      },
      {
        role: "user",
        content: "Approve the counter and lead routing. What about the Willow Park listing that's been sitting?",
      },
      {
        role: "assistant",
        content: "Counter-offer submitted and leads routed. Now for Willow Park:\n\n**128 Willow Park Drive — 30-Day Market Analysis:**\n• **Listed at:** $625,000 (4BR/3BA, 2,400 sqft)\n• **Showings:** 18 total, 6 in the first week, only 2 in the last 10 days\n• **Feedback themes:** \"Price feels high for the area,\" \"Kitchen needs updating\"\n• **Comp movement:** Two comparable listings in the area reduced by 3-4% this month\n\n**Recommended strategy:**\n1. **Price adjustment:** Reduce to $599,000 (-4.2%) to align with recent comps and hit the $600K search bracket\n2. **Marketing refresh:** New professional photos highlighting the renovated master suite and backyard. Schedule a twilight photo shoot.\n3. **Virtual tour update:** Add drone footage of the nearby park and school zone\n4. **Open house:** Schedule for this Saturday to capture weekend traffic after the price drop\n\nThis approach has historically recovered stale listings within 14 days in this zip code.",
      },
      {
        role: "user",
        content: "Go with the price reduction and schedule the open house. How's the team performing this month?",
      },
      {
        role: "assistant",
        content: "Price adjustment submitted to MLS — goes live within the hour. Open house scheduled for Saturday 1-4 PM with automated social media promotion.\n\n**February Team Performance:**\n• **Active listings:** 34 (up from 28 last month)\n• **Closings MTD:** 11 transactions, $5.2M total volume\n• **Pending:** 8 transactions, $3.8M in pipeline\n• **Avg days on market:** 24 days (market average: 32)\n• **Lead conversion rate:** 34% (team target: 30%)\n\n**Top performers:**\n• **Maria Santos** — 4 closings, $1.9M volume, 98% client satisfaction\n• **Kevin Wright** — 3 closings + 2 pending, strongest in luxury segment\n• **Alisha Patel** — Highest lead conversion at 41%, first-time buyer specialist\n\nCommission pool stands at $156K for the month with 8 more pending closings to process.",
      },
      {
        role: "user",
        content: "Send Maria a congratulations message and pull up the full commission report.",
      },
      {
        role: "assistant",
        content: "Congratulations message sent to Maria via Slack and email. Here's the commission overview:\n\n**February Commission Report:**\n| Agent | Closings | Volume | Commission | Status |\n|-------|----------|--------|------------|--------|\n| Maria Santos | 4 | $1.9M | $47,500 | Paid: 2, Pending: 2 |\n| Kevin Wright | 3 | $1.4M | $35,000 | Paid: 1, Pending: 2 |\n| Alisha Patel | 2 | $780K | $19,500 | Paid: 2 |\n| Derek Thompson | 2 | $1.1M | $27,500 | Pending: 2 |\n\n**Totals:** $156,500 in commissions, $5.2M closed volume. Brokerage split (after agent payouts): $62,600. Eight pending transactions worth approximately $95K in additional commissions expected to close by month-end.",
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning. Here's your PropelEstate briefing for Thursday, February 20th.", durationMs: 3200 },
      { speaker: "agent", text: "Twelve new leads came in overnight — four scored above 80 and are flagged for immediate outreach. Top lead is Sarah Kim, pre-approved and relocating from Chicago with an urgent timeline in the $600 to $750K range. You have five showings today starting at 10 AM at Maple Ridge.", durationMs: 10200 },
      { speaker: "agent", text: "The Thompson offer on 42 Elm Street received a seller counter at $498K. Based on comparable sales, I recommend countering at $493K — deadline is 5 PM today. The Willow Park listing hit 30 days on market and I've prepared a price reduction strategy to $599K with a Saturday open house.", durationMs: 11400 },
      { speaker: "agent", text: "Team update: 11 closings so far this month for $5.2M in volume with 8 more pending. Lead conversion is at 34%, above the 30% target. Maria Santos leads with 4 closings and $1.9M in volume. Commission pool is tracking at $156K with more expected before month-end.", durationMs: 10800 },
    ],
    summary: "Morning briefing covered 12 new leads with 4 high-priority, Thompson counter-offer strategy, Willow Park price adjustment plan, 5 scheduled showings, and team performance at $5.2M closed volume with 34% lead conversion.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "MLS/IDX Feed", icon: "database", category: "Listings", description: "Real-time MLS listing sync, IDX search, and property data aggregation" },
      { name: "Zillow API", icon: "home", category: "Market Data", description: "Zestimate values, market trends, and listing syndication" },
      { name: "DocuSign", icon: "pen-tool", category: "Contracts", description: "Electronic signatures for purchase agreements, disclosures, and amendments" },
      { name: "ShowingTime", icon: "clock", category: "Scheduling", description: "Automated showing coordination with buyer agents and lockbox access" },
      { name: "Title Company Portal", icon: "shield", category: "Closing", description: "Title search status, escrow tracking, and closing document management" },
      { name: "Matterport", icon: "box", category: "Virtual Tours", description: "3D property tours, floor plans, and virtual staging integration" },
      COMMON_INTEGRATIONS.hubspot,
      COMMON_INTEGRATIONS.googleEmail,
      COMMON_INTEGRATIONS.calendar,
      COMMON_INTEGRATIONS.slack,
      COMMON_INTEGRATIONS.stripe,
      COMMON_INTEGRATIONS.imageGen,
      COMMON_INTEGRATIONS.github,
      COMMON_INTEGRATIONS.vercel,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: "Design listing and property schema with MLS data mapping", stage: "plan", status: "complete" },
      { title: "Define lead scoring model with buyer intent and financial signals", stage: "plan", status: "complete" },
      { title: "Build listing management dashboard with MLS sync and media gallery", stage: "build", status: "complete" },
      { title: "Implement client portal with saved searches and showing requests", stage: "build", status: "complete" },
      { title: "Create transaction pipeline with milestone tracking and document management", stage: "build", status: "active" },
      { title: "Build market analysis engine with comparable sales and pricing recommendations", stage: "build", status: "pending" },
      { title: "Integrate showing scheduler with calendar sync and automated feedback collection", stage: "launch", status: "pending" },
      { title: "Deploy with IDX compliance verification and agent onboarding", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "listings", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "[mlsId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "new", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "clients", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "[clientId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "leads", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "transactions", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "[transactionId]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "pipeline", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "showings", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "schedule", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "market", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "comps", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "reports", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "listings", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "clients", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "transactions", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "showings", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "market", type: "folder", children: [
                { name: "route.ts", type: "file" },
                { name: "comps", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
              { name: "webhooks", type: "folder", children: [
                { name: "mls", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "docusign", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "mls-client.ts", type: "file" },
          { name: "lead-scorer.ts", type: "file" },
          { name: "market-analyzer.ts", type: "file" },
          { name: "commission-calculator.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Real Estate Contracts", icon: "file-text", count: 42 },
      { name: "Market Data & Trends", icon: "trending-up", count: 38 },
      { name: "Zoning & Regulations", icon: "landmark", count: 24 },
      { name: "Mortgage Guidelines", icon: "banknote", count: 19 },
      { name: "Disclosure Requirements", icon: "shield", count: 31 },
    ],
    documents: [
      { title: "Purchase Agreement Template Library", category: "Real Estate Contracts", tier: "index", lines: 120, crossRefs: ["Seller Disclosure Checklist", "Contingency Clause Reference"] },
      { title: "Seller Disclosure Checklist", category: "Disclosure Requirements", tier: "detail", lines: 310 },
      { title: "Contingency Clause Reference", category: "Real Estate Contracts", tier: "detail", lines: 275 },
      { title: "Comparable Market Analysis Framework", category: "Market Data & Trends", tier: "summary", lines: 195, crossRefs: ["Neighborhood Price Trend Reports"] },
      { title: "Neighborhood Price Trend Reports", category: "Market Data & Trends", tier: "detail", lines: 480 },
      { title: "Residential Zoning Classification Guide", category: "Zoning & Regulations", tier: "summary", lines: 165, crossRefs: ["Seller Disclosure Checklist"] },
      { title: "FHA/VA/Conventional Loan Requirements", category: "Mortgage Guidelines", tier: "detail", lines: 350 },
      { title: "Lead Paint & Environmental Disclosures", category: "Disclosure Requirements", tier: "detail", lines: 220, crossRefs: ["Seller Disclosure Checklist"] },
      { title: "Commission Structure & Split Agreements", category: "Real Estate Contracts", tier: "summary", lines: 140 },
      { title: "Title Insurance & Escrow Process Guide", category: "Real Estate Contracts", tier: "detail", lines: 290, crossRefs: ["Purchase Agreement Template Library"] },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Listings Sold (Monthly)",
        type: "bar",
        data: [
          { name: "Sep", value: 18 },
          { name: "Oct", value: 22 },
          { name: "Nov", value: 19 },
          { name: "Dec", value: 14 },
          { name: "Jan", value: 21 },
          { name: "Feb", value: 24 },
        ],
      },
      {
        label: "Avg Days on Market",
        type: "line",
        data: [
          { name: "Sep", value: 35 },
          { name: "Oct", value: 31 },
          { name: "Nov", value: 33 },
          { name: "Dec", value: 38 },
          { name: "Jan", value: 29 },
          { name: "Feb", value: 24 },
        ],
      },
    ],
    agents: [
      { name: "Broker AI", role: "Orchestrates all brokerage operations, agent coordination, and strategic decisions", avatar: "🏛️", color: "blue", tasks: ["Brokerage oversight", "Agent performance tracking", "Strategic planning"] },
      { name: "Listing Agent", role: "Manages property listings, pricing strategy, and marketing campaigns", avatar: "🏠", color: "emerald", tasks: ["Listing creation", "Price optimization", "Marketing coordination"], reportsTo: "Broker AI" },
      { name: "Buyer Agent", role: "Matches buyers to properties and manages showing schedules", avatar: "🔍", color: "violet", tasks: ["Property matching", "Showing scheduling", "Offer preparation"], reportsTo: "Broker AI" },
      { name: "Transaction Coordinator", role: "Tracks deals from accepted offer through closing", avatar: "📋", color: "amber", tasks: ["Document tracking", "Deadline management", "Closing coordination"], reportsTo: "Broker AI" },
      { name: "Market Analyst", role: "Generates CMA reports and monitors market trends", avatar: "📊", color: "rose", tasks: ["Comparable analysis", "Trend monitoring", "Price forecasting"], reportsTo: "Broker AI" },
      { name: "Lead Qualifier", role: "Scores and qualifies incoming leads based on intent and financial readiness", avatar: "🎯", color: "cyan", tasks: ["Lead scoring", "Pre-qualification", "Nurture sequences"], reportsTo: "Broker AI" },
      { name: "Marketing Agent", role: "Creates listing materials, social media content, and open house promotions", avatar: "📣", color: "green", tasks: ["Photo scheduling", "Social media posts", "Open house promotion"], reportsTo: "Listing Agent" },
    ],
    humanReviewPoints: [
      { agent: "Listing Agent", task: "Price reduction exceeding 5%", reason: "Significant price adjustments require broker review to ensure alignment with seller expectations and market positioning" },
      { agent: "Transaction Coordinator", task: "Contingency deadline extension", reason: "Extending inspection or financing contingencies affects closing timeline and requires agent and client approval" },
      { agent: "Buyer Agent", task: "Offer submission above client budget", reason: "Offers exceeding the buyer's stated budget or pre-approval amount require explicit client authorization before submission" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Full brokerage dashboard — listings, transactions, showings, and market analytics" :
        ch.name === "WhatsApp" ? "\"New showing request for 42 Elm Street — buyer pre-approved at $520K. Confirm for 2 PM?\"" :
        ch.name === "Telegram" ? "Real-time lead alerts, showing confirmations, and offer status updates" :
        ch.name === "Discord" ? "Agent team room — coordinate showings, share market intel, and discuss deal strategy" :
        ch.name === "Slack" ? "Use /listings, /showings, or /pipeline for instant property and transaction data" :
        ch.name === "Email" ? "Daily lead digest, showing schedules, transaction milestones, and market reports" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("propelestate", "https://propelestate.vercel.app"),
    projectUrl: "https://propelestate.vercel.app",
    stats: [
      { label: "Properties Listed", value: "3,500+" },
      { label: "Lead Conversion", value: "34%" },
      { label: "Avg Days to Close", value: "28" },
      { label: "Client Satisfaction", value: "4.9/5" },
    ],
  },
};

export default content;
