import type { UseCaseDemoContent } from "../types";
import { COMMON_CHANNELS, COMMON_INTEGRATIONS, makeDeployTerminal } from "./_shared";
import type { TechOverlay, OperationsContent } from "../types";

const content: UseCaseDemoContent = {
  // ─── Onboarding ────────────────────────────────────────────────────
  onboarding: {
    industries: [
      { id: "fashion", name: "Fashion & Apparel", emoji: "👗" },
      { id: "electronics", name: "Electronics", emoji: "📱" },
      { id: "food-bev", name: "Food & Beverage", emoji: "🍕" },
      { id: "beauty", name: "Beauty & Wellness", emoji: "💄" },
      { id: "home-garden", name: "Home & Garden", emoji: "🏡" },
      { id: "sports", name: "Sports & Outdoor", emoji: "⚽" },
    ],
    verticals: [
      { id: "dtc", name: "Direct-to-Consumer" },
      { id: "marketplace", name: "Multi-Vendor Marketplace" },
      { id: "subscription", name: "Subscription Commerce" },
      { id: "b2b-wholesale", name: "B2B Wholesale" },
    ],
    features: [
      { id: "product-catalog", name: "Product Catalog Management" },
      { id: "inventory-sync", name: "Inventory Sync" },
      { id: "dynamic-pricing", name: "Dynamic Pricing" },
      { id: "cart-recovery", name: "Cart Abandonment Recovery" },
      { id: "reviews-ugc", name: "Reviews & UGC" },
      { id: "personalization", name: "AI Personalization" },
    ],
    autoSelections: {
      industry: "fashion",
      vertical: "dtc",
      features: ["product-catalog", "inventory-sync", "cart-recovery", "personalization"],
      autonomy: {
        "product-catalog": "full",
        "inventory-sync": "full",
        "dynamic-pricing": "supervised",
        "cart-recovery": "full",
        "reviews-ugc": "full",
        "personalization": "full",
      },
    },
    projectName: "ShopVelocity",
    projectDescription: "AI-driven e-commerce platform with personalized shopping experiences, smart inventory management, and automated cart recovery for DTC brands.",
  },

  // ─── Dashboard ─────────────────────────────────────────────────────
  dashboard: {
    projectName: "ShopVelocity",
    projectBadge: "E-Commerce",
    projectDescription: "Maximize revenue per visitor with AI-powered product recommendations, real-time inventory optimization, and automated marketing workflows that convert browsers into buyers.",
  },

  // ─── Chat ──────────────────────────────────────────────────────────
  chat: {
    script: [
      {
        role: "assistant",
        content: "Morning update: Yesterday's revenue was $47,820 across 312 orders (AOV: $153.27). Conversion rate hit 3.8% — up from 3.2% last week. However, cart abandonment spiked to 71% in the evening session. I've identified the likely cause: the new shipping calculator was returning errors for international addresses.",
      },
      {
        role: "user",
        content: "Fix the shipping calculator issue and show me what products are trending this week.",
      },
      {
        role: "assistant",
        content: "I've identified the bug — the shipping API was timing out for addresses with diacritics in the street name. A normalization fix is ready to deploy.\n\nThis week's trending products:\n1. **Oversized Linen Blazer** — 284 units sold, +62% vs. last week\n2. **Recycled Canvas Tote** — 198 units, featured in an influencer unboxing\n3. **Merino Wool Sneakers** — 156 units, low stock alert (28 remaining)\n4. **Bamboo Sunglasses** — 142 units, new arrival generating organic buzz\n\nThe Merino Wool Sneakers are at risk of stockout by Saturday at current velocity. Want me to trigger an expedited reorder?",
        action: {
          type: "approval",
          title: "Deploy Shipping Fix & Reorder Sneakers",
          description: "Deploy the address normalization fix to production (resolves international shipping calculator errors). Also trigger an expedited reorder of 500 units of Merino Wool Sneakers from supplier MeriFoot Co. (est. delivery: 5 business days).",
        },
      },
      {
        role: "user",
        content: "Approve both. What about the abandoned carts from last night?",
      },
      {
        role: "assistant",
        content: "Shipping fix deployed and sneaker reorder confirmed. Now for abandoned carts:\n\n**Last night's abandoned carts**: 187 sessions, $28,400 in potential revenue.\n\nI've segmented them into three recovery campaigns:\n• **High-value carts ($200+)**: 34 carts — sending personalized 10% discount email within 1 hour\n• **Repeat visitors**: 52 carts — sending \"still interested?\" reminder with saved cart link\n• **First-time visitors**: 101 carts — entering 3-touch nurture sequence (browse reminder → social proof → limited offer)\n\nBased on historical recovery rates, I estimate we'll recapture $6,800-$8,200 from this batch.",
      },
      {
        role: "user",
        content: "Launch the campaigns. Also, how's our inventory health overall?",
      },
      {
        role: "assistant",
        content: "Campaigns launched — you'll see recovery metrics in tomorrow's digest. Inventory snapshot:\n\n• **Healthy (>30 days supply)**: 842 SKUs (78%)\n• **Watch (15-30 days)**: 145 SKUs (13%) — including 3 best-sellers\n• **Critical (<15 days)**: 52 SKUs (5%) — Merino Sneakers reorder in progress\n• **Overstock (>90 days)**: 43 SKUs (4%) — mostly last season's collection\n\nFor the overstock items, I recommend a flash sale. The 43 SKUs represent $34K in tied-up capital. A 30% markdown would move most within 2 weeks based on price elasticity modeling.",
      },
      {
        role: "user",
        content: "Set up the flash sale for next Tuesday. Use the seasonal clearance template.",
      },
      {
        role: "assistant",
        content: "Flash sale scheduled for Tuesday, Feb 24 at 9 AM EST:\n• 43 overstock SKUs with 30% markdown\n• Using \"Seasonal Clearance\" email template — sending to the 12,400 subscribers who engaged in the last 30 days\n• Landing page auto-generated with countdown timer\n• Social ads will go live 24 hours before on Instagram and Facebook\n• Inventory holds released for discounted items\n\nEstimated revenue recovery: $22K-$26K. I'll have the creative assets ready for your review by Monday morning.",
      },
    ],
  },

  // ─── Voice ─────────────────────────────────────────────────────────
  voice: {
    transcript: [
      { speaker: "agent", text: "Good morning. Here's your ShopVelocity commerce briefing for February 20th.", durationMs: 3200 },
      { speaker: "agent", text: "Yesterday's revenue was $47,820 across 312 orders, with an average order value of $153. Conversion rate is at 3.8%, trending upward. However, cart abandonment jumped to 71% due to a shipping calculator bug affecting international orders — a fix is ready to deploy.", durationMs: 10400 },
      { speaker: "agent", text: "Top trending product is the Oversized Linen Blazer with 284 units sold this week. Merino Wool Sneakers are at risk of stockout — 28 units remaining at current velocity. I've prepared an expedited reorder for your approval.", durationMs: 8600 },
      { speaker: "agent", text: "Marketing update: 187 abandoned carts from last night representing $28K in potential revenue. Recovery campaigns are segmented and ready to launch. The flash sale for 43 overstock SKUs is being prepped for Tuesday with estimated recovery of $22K to $26K.", durationMs: 9800 },
    ],
    summary: "Commerce briefing covered $47.8K daily revenue, trending products, shipping bug fix, Merino Sneakers stockout risk, abandoned cart recovery campaigns, and upcoming flash sale for overstock clearance.",
  },

  // ─── Integrations ──────────────────────────────────────────────────
  integrations: {
    integrations: [
      { name: "Shopify", icon: "shopping-bag", category: "Commerce", description: "Storefront management, product catalog, and checkout processing" },
      { name: "Klaviyo", icon: "mail", category: "Marketing", description: "Email/SMS marketing automation with behavioral triggers" },
      { name: "ShipStation", icon: "truck", category: "Fulfillment", description: "Multi-carrier shipping, label printing, and delivery tracking" },
      { name: "Returnly", icon: "rotate-ccw", category: "Returns", description: "Automated returns processing with instant credit and exchanges" },
      { name: "Yotpo", icon: "star", category: "Social Proof", description: "Product reviews, UGC collection, and loyalty programs" },
      { name: "Algolia", icon: "search", category: "Search", description: "AI-powered product search with typo tolerance and faceting" },
      COMMON_INTEGRATIONS.stripe,
      COMMON_INTEGRATIONS.analytics,
      COMMON_INTEGRATIONS.googleEmail,
      COMMON_INTEGRATIONS.slack,
      COMMON_INTEGRATIONS.imageGen,
      COMMON_INTEGRATIONS.posthog,
      COMMON_INTEGRATIONS.github,
      COMMON_INTEGRATIONS.vercel,
      COMMON_INTEGRATIONS.sentry,
    ],
  },

  // ─── Build ─────────────────────────────────────────────────────────
  build: {
    checklist: [
      { title: "Design product catalog schema with variant and inventory models", stage: "plan", status: "complete" },
      { title: "Map Shopify Storefront API endpoints and webhook events", stage: "plan", status: "complete" },
      { title: "Build product listing pages with AI-powered search and filters", stage: "build", status: "complete" },
      { title: "Implement cart system with real-time inventory validation", stage: "build", status: "complete" },
      { title: "Create abandoned cart recovery engine with multi-touch sequences", stage: "build", status: "active" },
      { title: "Build personalization engine for product recommendations", stage: "build", status: "pending" },
      { title: "Integrate multi-carrier shipping with rate comparison", stage: "launch", status: "pending" },
      { title: "Deploy with CDN optimization and performance monitoring", stage: "launch", status: "pending" },
    ],
    fileTree: [
      {
        name: "app", type: "folder", children: [
          { name: "layout.tsx", type: "file" },
          { name: "page.tsx", type: "file" },
          {
            name: "shop", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "[category]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "product", type: "folder", children: [
                { name: "[slug]", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              ] },
            ],
          },
          { name: "cart", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          { name: "checkout", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
          {
            name: "dashboard", type: "folder", children: [
              { name: "page.tsx", type: "file" },
              { name: "orders", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "inventory", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "analytics", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
              { name: "campaigns", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
            ],
          },
          {
            name: "api", type: "folder", children: [
              { name: "products", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "cart", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "orders", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "inventory", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "recommendations", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              { name: "webhooks", type: "folder", children: [
                { name: "shopify", type: "folder", children: [{ name: "route.ts", type: "file" }] },
                { name: "shipping", type: "folder", children: [{ name: "route.ts", type: "file" }] },
              ] },
            ],
          },
        ],
      },
      {
        name: "lib", type: "folder", children: [
          { name: "shopify-client.ts", type: "file" },
          { name: "recommendation-engine.ts", type: "file" },
          { name: "cart-recovery.ts", type: "file" },
          { name: "inventory-sync.ts", type: "file" },
        ],
      },
    ],
  },

  // ─── Knowledge ─────────────────────────────────────────────────────
  knowledge: {
    categories: [
      { name: "Product Catalog", icon: "shopping-bag", count: 48 },
      { name: "Marketing Playbooks", icon: "megaphone", count: 22 },
      { name: "Fulfillment SOPs", icon: "truck", count: 16 },
      { name: "Customer Service Scripts", icon: "headphones", count: 34 },
      { name: "Pricing Strategy", icon: "tag", count: 11 },
    ],
    documents: [
      { title: "Product Photography & Copy Guidelines", category: "Product Catalog", tier: "index", lines: 95, crossRefs: ["Brand Voice Guide", "SEO Best Practices for Product Pages"] },
      { title: "Brand Voice Guide", category: "Marketing Playbooks", tier: "detail", lines: 280 },
      { title: "SEO Best Practices for Product Pages", category: "Marketing Playbooks", tier: "detail", lines: 210 },
      { title: "Cart Abandonment Recovery Playbook", category: "Marketing Playbooks", tier: "summary", lines: 175, crossRefs: ["Email Sequence Templates"] },
      { title: "Email Sequence Templates", category: "Marketing Playbooks", tier: "detail", lines: 420 },
      { title: "Returns & Exchanges Policy", category: "Customer Service Scripts", tier: "summary", lines: 130 },
      { title: "Shipping Carrier Rate Comparison", category: "Fulfillment SOPs", tier: "detail", lines: 340, crossRefs: ["International Shipping Guidelines"] },
      { title: "International Shipping Guidelines", category: "Fulfillment SOPs", tier: "detail", lines: 260 },
      { title: "Dynamic Pricing Rules Engine", category: "Pricing Strategy", tier: "summary", lines: 185, crossRefs: ["Cart Abandonment Recovery Playbook"] },
      { title: "Flash Sale Operations Checklist", category: "Marketing Playbooks", tier: "summary", lines: 110 },
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────────────
  analytics: {
    charts: [
      {
        label: "Daily Revenue ($K)",
        type: "bar",
        data: [
          { name: "Mon", value: 38 },
          { name: "Tue", value: 42 },
          { name: "Wed", value: 45 },
          { name: "Thu", value: 48 },
          { name: "Fri", value: 56 },
          { name: "Sat", value: 62 },
          { name: "Sun", value: 51 },
        ],
      },
      {
        label: "Conversion Rate (%)",
        type: "line",
        data: [
          { name: "Sep", value: 2.8 },
          { name: "Oct", value: 3.1 },
          { name: "Nov", value: 3.6 },
          { name: "Dec", value: 4.2 },
          { name: "Jan", value: 3.4 },
          { name: "Feb", value: 3.8 },
        ],
      },
    ],
    agents: [
      { name: "Commerce Director", role: "Orchestrates all e-commerce operations and revenue optimization", avatar: "🛍️", color: "blue", tasks: ["Revenue monitoring", "Strategy coordination", "Performance analysis"] },
      { name: "Product Agent", role: "Manages catalog, pricing, and product content", avatar: "📦", color: "emerald", tasks: ["Catalog updates", "Dynamic pricing", "SEO optimization"], reportsTo: "Commerce Director" },
      { name: "Inventory Agent", role: "Tracks stock levels and manages reorders", avatar: "📊", color: "violet", tasks: ["Stock monitoring", "Reorder triggers", "Supplier coordination"], reportsTo: "Commerce Director" },
      { name: "Cart Recovery Agent", role: "Recovers abandoned carts with targeted campaigns", avatar: "🛒", color: "amber", tasks: ["Abandonment detection", "Recovery sequences", "Discount optimization"], reportsTo: "Commerce Director" },
      { name: "Personalization Engine", role: "Delivers AI-powered product recommendations", avatar: "✨", color: "rose", tasks: ["Behavioral tracking", "Recommendation serving", "A/B testing"], reportsTo: "Commerce Director" },
      { name: "Marketing Agent", role: "Manages email campaigns, social ads, and promotions", avatar: "📣", color: "cyan", tasks: ["Campaign scheduling", "Audience segmentation", "Creative generation"], reportsTo: "Commerce Director" },
      { name: "Fulfillment Agent", role: "Coordinates shipping, tracking, and delivery", avatar: "🚚", color: "green", tasks: ["Order routing", "Carrier selection", "Delivery tracking"], reportsTo: "Inventory Agent" },
      { name: "Customer Support Agent", role: "Handles order inquiries and returns processing", avatar: "💬", color: "slate", tasks: ["Order status inquiries", "Return processing", "Review solicitation"], reportsTo: "Commerce Director" },
      { name: "Analytics Agent", role: "Tracks KPIs and generates actionable insights", avatar: "📈", color: "orange", tasks: ["Funnel analysis", "Cohort tracking", "Revenue attribution"], reportsTo: "Commerce Director" },
    ],
    humanReviewPoints: [
      { agent: "Product Agent", task: "Price reduction exceeding 40%", reason: "Deep discounts may impact brand perception and require marketing approval" },
      { agent: "Cart Recovery Agent", task: "High-value discount code generation", reason: "Discount codes above $50 require finance team authorization to prevent margin erosion" },
      { agent: "Marketing Agent", task: "Campaign targeting VIP customers", reason: "Communications to top-tier loyalty members require brand team review for tone and exclusivity" },
    ],
  },

  // ─── Channels ──────────────────────────────────────────────────────
  channels: {
    channels: COMMON_CHANNELS.map((ch) => ({
      ...ch,
      previewMessage:
        ch.name === "Web Portal" ? "Full commerce dashboard — orders, inventory, campaigns, and revenue analytics" :
        ch.name === "WhatsApp" ? "\"Your Merino Sneakers are back in stock! Only 28 pairs left. Shop now.\"" :
        ch.name === "Telegram" ? "Real-time order alerts, inventory warnings, and daily revenue summaries" :
        ch.name === "Discord" ? "Team storefront ops — coordinate launches, flash sales, and inventory moves" :
        ch.name === "Slack" ? "Use /orders, /inventory, or /revenue for instant commerce data" :
        ch.name === "Email" ? "Daily revenue digest, campaign performance, and inventory alerts" :
        ch.previewMessage,
    })),
  },

  // ─── Deploy ────────────────────────────────────────────────────────
  deploy: {
    terminalLines: makeDeployTerminal("shopvelocity", "https://shopvelocity.vercel.app"),
    projectUrl: "https://shopvelocity.vercel.app",
    stats: [
      { label: "Monthly Revenue", value: "$342K" },
      { label: "Conversion Rate", value: "3.8%" },
      { label: "Cart Recovery", value: "24%" },
      { label: "Avg. Order Value", value: "$153" },
    ],
  },

  // ─── Operations (Day 2+) ──────────────────────────────────────────
  operations: {
    events: [
      { day: 2, label: "SEO optimization: meta tags, structured data, and sitemap generated for all 842 product pages", type: "gtm" },
      { day: 3, label: "First customer onboarded — order #001 processed and shipped automatically", type: "growth" },
      { day: 5, label: "Cart abandonment recovery sent 312 emails — 24% recovery rate, $6.8K recaptured", type: "gtm" },
      { day: 7, label: "Uptime monitor: 100% availability, avg response time 142ms, zero errors detected", type: "monitor" },
      { day: 10, label: "Inventory Agent triggered auto-reorder for 3 low-stock SKUs from supplier API", type: "iterate" },
      { day: 14, label: "Instagram Shopping integration deployed — social feed synced with product catalog", type: "gtm" },
      { day: 21, label: "Bug detected in checkout flow for Safari mobile — patch deployed in 4 minutes", type: "fix" },
      { day: 30, label: "Monthly report: 1,247 orders, $191K revenue, 3.9% conversion, 99.98% uptime", type: "monitor" },
      { day: 45, label: "A/B test completed: new product page layout → +12% conversion lift, deployed to 100%", type: "iterate" },
      { day: 60, label: "Launched loyalty program — 2,400 members enrolled, repeat purchase rate up 18%", type: "growth" },
      { day: 90, label: "Q1 review: $580K total revenue, 3,800 customers, NPS 72, zero downtime incidents", type: "growth" },
    ],
    finalMetrics: [
      { label: "Q1 Revenue", value: "$580K" },
      { label: "Customers", value: "3,800" },
      { label: "Uptime", value: "99.98%" },
      { label: "Time to Market", value: "12 min" },
    ],
  } satisfies OperationsContent,

  // ─── Tech Overlay ─────────────────────────────────────────────────
  techOverlay: {
    build: {
      codeSnippets: [
        {
          filename: "app/shop/[category]/page.tsx",
          language: "tsx",
          code: `import { Suspense } from "react";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProductGrid } from "@/components/product-grid";
import { Filters } from "@/components/filters";

type Props = { params: Promise<{ category: string }> };

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const items = await db
    .select()
    .from(products)
    .where(eq(products.category, category))
    .orderBy(desc(products.createdAt));

  return (
    <div className="grid grid-cols-[240px_1fr] gap-6">
      <Filters category={category} />
      <Suspense fallback={<ProductGrid.Skeleton />}>
        <ProductGrid products={items} />
      </Suspense>
    </div>
  );
}`,
        },
        {
          filename: "lib/cart-recovery.ts",
          language: "ts",
          code: `import { db } from "@/lib/db";
import { carts, recoveryEmails } from "@/lib/db/schema";
import { eq, lt, and, isNull } from "drizzle-orm";
import { sendEmail } from "@/lib/email";

export async function processAbandonedCarts() {
  const threshold = new Date(Date.now() - 60 * 60 * 1000);

  const abandoned = await db
    .select()
    .from(carts)
    .where(
      and(
        lt(carts.updatedAt, threshold),
        isNull(carts.completedAt),
        eq(carts.recoveryStatus, "none")
      )
    );

  for (const cart of abandoned) {
    const discount = cart.totalCents > 20000 ? 10 : 5;

    await sendEmail({
      to: cart.email,
      template: "cart-recovery",
      data: { items: cart.items, discount },
    });

    await db
      .update(carts)
      .set({ recoveryStatus: "email_sent" })
      .where(eq(carts.id, cart.id));
  }

  return { processed: abandoned.length };
}`,
        },
        {
          filename: "components/product-grid.tsx",
          language: "tsx",
          code: `"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/db/schema";

type Props = { products: Product[] };

export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {product.stock < 10 && (
              <Badge className="absolute right-2 top-2 bg-red-500">
                Only {product.stock} left
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-lg font-bold">
              {formatPrice(product.priceCents)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`,
        },
      ],
      terminalCommands: [
        { command: "pnpm install", output: "Packages: +312\nProgress: resolved 487, reused 412, downloaded 75\ndone in 5.1s", delay: 2000 },
        { command: "pnpm drizzle-kit push", output: "Pushing schema...\n✓ products table created\n✓ carts table created\n✓ orders table created\n✓ recovery_emails table created\n✓ 4 tables synced", delay: 3500 },
        { command: "pnpm test", output: "Running 18 test suites...\n✓ Cart recovery (4 tests)\n✓ Product API (5 tests)\n✓ Checkout flow (3 tests)\n✓ Inventory sync (3 tests)\n✓ Components (3 tests)\n\nAll 18 tests passed", delay: 5500 },
        { command: "pnpm build", output: "▲ Next.js 16.0.0\n✓ Compiled in 4.8s\n\nRoute (app)              Size\n○ /                      5.4 kB\n○ /shop/[category]       3.8 kB\n○ /product/[slug]        4.2 kB\n○ /cart                  6.1 kB\n○ /checkout              7.8 kB\nƒ /api/products          2.1 kB\nƒ /api/cart              1.8 kB\nƒ /api/webhooks/shopify  0.9 kB", delay: 8000 },
      ],
      testResults: [
        { name: "Cart: abandoned detection fires after 1hr", passed: true },
        { name: "Cart: recovery email includes discount code", passed: true },
        { name: "Cart: high-value carts get 10% discount", passed: true },
        { name: "Products: GET returns filtered by category", passed: true },
        { name: "Products: search with Algolia typo tolerance", passed: true },
        { name: "Checkout: validates inventory before charge", passed: true },
        { name: "Checkout: Stripe webhook updates order status", passed: true },
        { name: "Inventory: low-stock triggers reorder alert", passed: true },
        { name: "Component: ProductGrid renders correctly", passed: true },
        { name: "E2E: full purchase flow completes", passed: true },
      ],
    },
    deploy: {
      cicdSteps: [
        { name: "Install dependencies", duration: "5.1s" },
        { name: "Run tests", duration: "8.2s" },
        { name: "Build application", duration: "4.8s" },
        { name: "Deploy to Vercel", duration: "12s" },
        { name: "Run health checks", duration: "3s" },
      ],
      infraComponents: ["Vercel Edge", "Neon PostgreSQL", "Stripe", "Shopify API", "Algolia", "Sentry"],
    },
  } satisfies TechOverlay,
};

export default content;
