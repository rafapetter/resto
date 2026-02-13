import {
  LayoutDashboard,
  CalendarCheck,
  ShoppingCart,
  GraduationCap,
  Store,
  Briefcase,
  Palette,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────

export type Product = {
  id: string;
  name: string;
  description: string;
};

export type Vertical = {
  id: string;
  name: string;
  description: string;
  products: Product[];
  /** Suggested defaults for business info when this vertical is selected */
  defaults: {
    problemStatement: string;
    solution: string;
    targetCustomer: string;
    suggestedRevenue: string[];
  };
};

export type Industry = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  verticals: Vertical[];
};

// ─── Revenue / Business Model options ────────────────────────────────

export type RevenueOption = {
  id: string;
  label: string;
};

export const REVENUE_OPTIONS: RevenueOption[] = [
  { id: "subscription", label: "Subscription (Monthly / Annual)" },
  { id: "one_time", label: "One-time Purchase" },
  { id: "freemium", label: "Freemium" },
  { id: "transaction_fee", label: "Transaction / Commission Fee" },
  { id: "marketplace_fee", label: "Marketplace Fee" },
  { id: "pay_per_use", label: "Pay-per-use / Metered" },
  { id: "licensing", label: "Licensing" },
  { id: "advertising", label: "Advertising" },
  { id: "affiliate", label: "Affiliate / Referral" },
  { id: "white_label", label: "White Label / Reselling" },
  { id: "consulting", label: "Consulting / Services" },
  { id: "sponsorship", label: "Sponsorship" },
];

// ─── Industries ──────────────────────────────────────────────────────

export const INDUSTRIES: Industry[] = [
  // ── SaaS / Software ──
  {
    id: "saas",
    name: "SaaS / Software",
    description: "Cloud-based software products and platforms",
    icon: LayoutDashboard,
    verticals: [
      {
        id: "saas-healthcare",
        name: "Healthcare & Wellness",
        description: "Digital health, patient management, telehealth",
        products: [
          { id: "patient-portal", name: "Patient Portal", description: "Secure patient access to records and communication" },
          { id: "appointment-booking", name: "Appointment Booking", description: "Online scheduling with reminders and calendar sync" },
          { id: "telemedicine", name: "Telemedicine", description: "Video consultations and remote care" },
          { id: "ehr", name: "Electronic Health Records", description: "Digital medical records management" },
          { id: "billing-insurance", name: "Billing & Insurance", description: "Claims processing and payment management" },
          { id: "wellness-tracking", name: "Wellness Tracking", description: "Health metrics, habits, and goal tracking" },
        ],
        defaults: {
          problemStatement: "Healthcare providers struggle with fragmented systems for patient management, scheduling, and records",
          solution: "An integrated healthcare platform that streamlines patient interactions, records, and billing in one place",
          targetCustomer: "Independent clinics, wellness practitioners, and small healthcare practices",
          suggestedRevenue: ["subscription", "pay_per_use"],
        },
      },
      {
        id: "saas-education",
        name: "Education & Training",
        description: "Learning platforms, course management, assessments",
        products: [
          { id: "lms", name: "Learning Management System", description: "Course delivery, progress tracking, and certifications" },
          { id: "student-portal", name: "Student Portal", description: "Student dashboard with grades, schedule, and resources" },
          { id: "assessment", name: "Assessment & Testing", description: "Quizzes, exams, and automated grading" },
          { id: "certification", name: "Certification Management", description: "Issue and verify digital certificates" },
          { id: "live-classes", name: "Live Classes", description: "Real-time virtual classroom with interaction tools" },
        ],
        defaults: {
          problemStatement: "Educators and trainers lack affordable, integrated tools to deliver courses and track student progress",
          solution: "A learning platform with course creation, student management, assessments, and certification",
          targetCustomer: "Independent educators, training companies, and corporate L&D teams",
          suggestedRevenue: ["subscription", "freemium", "pay_per_use"],
        },
      },
      {
        id: "saas-finance",
        name: "Finance & Accounting",
        description: "Financial management, invoicing, budgeting",
        products: [
          { id: "invoicing", name: "Invoicing", description: "Create, send, and track invoices" },
          { id: "expense-tracking", name: "Expense Tracking", description: "Log and categorize business expenses" },
          { id: "budgeting", name: "Budgeting & Forecasting", description: "Financial planning and cash flow projections" },
          { id: "payroll", name: "Payroll", description: "Employee compensation and tax management" },
          { id: "reporting", name: "Financial Reporting", description: "P&L, balance sheets, and custom reports" },
        ],
        defaults: {
          problemStatement: "Small businesses waste hours on manual bookkeeping and lack visibility into their financial health",
          solution: "An automated financial management tool with invoicing, expense tracking, and real-time reporting",
          targetCustomer: "Small business owners, freelancers, and startup founders",
          suggestedRevenue: ["subscription", "freemium"],
        },
      },
      {
        id: "saas-project",
        name: "Project Management",
        description: "Task tracking, collaboration, resource planning",
        products: [
          { id: "task-boards", name: "Task Boards", description: "Kanban and list views for task management" },
          { id: "time-tracking", name: "Time Tracking", description: "Log hours and track productivity" },
          { id: "resource-planning", name: "Resource Planning", description: "Team workload and capacity management" },
          { id: "docs-wiki", name: "Docs & Wiki", description: "Team knowledge base and documentation" },
          { id: "client-portal", name: "Client Portal", description: "External-facing project status and communication" },
        ],
        defaults: {
          problemStatement: "Teams struggle to coordinate work across projects, leading to missed deadlines and miscommunication",
          solution: "A project management platform with task tracking, time logging, and team collaboration",
          targetCustomer: "Agencies, remote teams, and growing startups with 5-50 people",
          suggestedRevenue: ["subscription", "freemium"],
        },
      },
      {
        id: "saas-crm",
        name: "CRM & Sales",
        description: "Customer relationship management and sales pipelines",
        products: [
          { id: "contact-management", name: "Contact Management", description: "Organize and segment customer data" },
          { id: "sales-pipeline", name: "Sales Pipeline", description: "Visual deal tracking and forecasting" },
          { id: "email-automation", name: "Email Automation", description: "Drip campaigns and follow-up sequences" },
          { id: "analytics-dashboard", name: "Analytics Dashboard", description: "Sales metrics, conversion rates, and reports" },
          { id: "lead-scoring", name: "Lead Scoring", description: "AI-powered lead qualification and prioritization" },
        ],
        defaults: {
          problemStatement: "Sales teams lose deals due to scattered customer data and no systematic follow-up process",
          solution: "A CRM with pipeline management, automated follow-ups, and actionable sales analytics",
          targetCustomer: "B2B sales teams, agencies, and SMBs with dedicated sales reps",
          suggestedRevenue: ["subscription", "freemium"],
        },
      },
    ],
  },

  // ── E-commerce / Retail ──
  {
    id: "ecommerce",
    name: "E-commerce / Retail",
    description: "Online stores, product sales, and retail operations",
    icon: ShoppingCart,
    verticals: [
      {
        id: "ecom-fashion",
        name: "Fashion & Apparel",
        description: "Clothing, accessories, and fashion brands",
        products: [
          { id: "product-catalog", name: "Product Catalog", description: "Browse and filter products with images and variants" },
          { id: "size-guide", name: "Size Guide & Fit Finder", description: "Help customers find the right size" },
          { id: "wishlist", name: "Wishlist & Favorites", description: "Save items for later purchase" },
          { id: "subscription-box", name: "Subscription Boxes", description: "Curated recurring product deliveries" },
          { id: "returns", name: "Returns Management", description: "Easy returns and exchange processing" },
        ],
        defaults: {
          problemStatement: "Fashion brands struggle to create compelling online shopping experiences that reduce returns",
          solution: "A branded storefront with size guides, visual merchandising, and seamless checkout",
          targetCustomer: "Independent fashion brands and boutique retailers",
          suggestedRevenue: ["one_time", "subscription"],
        },
      },
      {
        id: "ecom-food",
        name: "Food & Beverage",
        description: "Food products, specialty items, meal kits",
        products: [
          { id: "menu-catalog", name: "Menu / Product Catalog", description: "Browse items with dietary info and photos" },
          { id: "ordering", name: "Online Ordering", description: "Cart, checkout, and delivery/pickup options" },
          { id: "subscriptions", name: "Meal Subscriptions", description: "Recurring meal plans and delivery schedules" },
          { id: "loyalty", name: "Loyalty Program", description: "Points, rewards, and repeat customer incentives" },
          { id: "inventory", name: "Inventory Management", description: "Stock levels, expiry tracking, and reordering" },
        ],
        defaults: {
          problemStatement: "Food businesses rely on third-party delivery apps that take 30% commissions and own the customer relationship",
          solution: "A direct ordering platform with delivery management, subscriptions, and customer loyalty tools",
          targetCustomer: "Restaurants, bakeries, specialty food producers, and meal prep companies",
          suggestedRevenue: ["one_time", "subscription", "transaction_fee"],
        },
      },
      {
        id: "ecom-digital",
        name: "Digital Products",
        description: "Ebooks, courses, templates, software, assets",
        products: [
          { id: "digital-storefront", name: "Digital Storefront", description: "Browse and purchase downloadable products" },
          { id: "instant-delivery", name: "Instant Delivery", description: "Automated file delivery after purchase" },
          { id: "license-management", name: "License Management", description: "Generate and validate product licenses" },
          { id: "bundles", name: "Bundles & Packages", description: "Group products together at a discount" },
          { id: "affiliate-program", name: "Affiliate Program", description: "Let others sell your products for commission" },
        ],
        defaults: {
          problemStatement: "Digital creators lose revenue to platform fees and lack control over their customer relationships",
          solution: "A self-hosted storefront for digital goods with instant delivery and low transaction costs",
          targetCustomer: "Content creators, developers, designers, and educators selling digital assets",
          suggestedRevenue: ["one_time", "licensing", "affiliate"],
        },
      },
      {
        id: "ecom-home",
        name: "Home & Lifestyle",
        description: "Home goods, furniture, decor, garden",
        products: [
          { id: "visual-catalog", name: "Visual Catalog", description: "Rich product galleries with room scenes" },
          { id: "configurator", name: "Product Configurator", description: "Customize colors, materials, and dimensions" },
          { id: "delivery-scheduling", name: "Delivery Scheduling", description: "Large-item delivery windows and tracking" },
          { id: "reviews", name: "Customer Reviews", description: "Product ratings and photo reviews" },
          { id: "gift-registry", name: "Gift Registry", description: "Wishlists and gift registries for occasions" },
        ],
        defaults: {
          problemStatement: "Home goods brands need rich visual experiences and delivery logistics that generic platforms don't offer",
          solution: "A visual e-commerce store with product configurators, reviews, and delivery management",
          targetCustomer: "Home decor brands, furniture makers, and lifestyle product companies",
          suggestedRevenue: ["one_time", "subscription"],
        },
      },
    ],
  },

  // ── Marketplace / Platform ──
  {
    id: "marketplace",
    name: "Marketplace / Platform",
    description: "Two-sided platforms connecting buyers and sellers",
    icon: Store,
    verticals: [
      {
        id: "mkt-services",
        name: "Services Marketplace",
        description: "Home services, professional services, freelancing",
        products: [
          { id: "provider-profiles", name: "Provider Profiles", description: "Detailed profiles with portfolio and credentials" },
          { id: "search-matching", name: "Search & Matching", description: "Find and filter providers by skill, location, price" },
          { id: "booking-scheduling", name: "Booking & Scheduling", description: "Book services and manage appointments" },
          { id: "reviews-ratings", name: "Reviews & Ratings", description: "Two-sided review system for trust building" },
          { id: "escrow-payments", name: "Escrow Payments", description: "Secure payments released on completion" },
          { id: "messaging", name: "In-App Messaging", description: "Direct communication between buyers and sellers" },
        ],
        defaults: {
          problemStatement: "Consumers struggle to find and trust service providers, while providers struggle to find customers",
          solution: "A marketplace matching customers with vetted providers, with reviews, booking, and secure payments",
          targetCustomer: "Consumers needing services and independent professionals providing them",
          suggestedRevenue: ["marketplace_fee", "transaction_fee", "subscription"],
        },
      },
      {
        id: "mkt-rental",
        name: "Rental Marketplace",
        description: "Equipment, spaces, vehicles, and asset rentals",
        products: [
          { id: "listing-management", name: "Listing Management", description: "Create and manage rental listings with availability" },
          { id: "availability-calendar", name: "Availability Calendar", description: "Real-time availability and booking windows" },
          { id: "pricing-engine", name: "Dynamic Pricing", description: "Hourly, daily, weekly rates with seasonal pricing" },
          { id: "damage-deposits", name: "Damage Deposits", description: "Security deposits and damage claim handling" },
          { id: "identity-verification", name: "Identity Verification", description: "Verify renters for trust and safety" },
        ],
        defaults: {
          problemStatement: "Asset owners can't easily monetize idle equipment or spaces, and renters lack a trusted platform",
          solution: "A rental marketplace with availability management, secure payments, and verification",
          targetCustomer: "Asset owners and individuals/businesses looking to rent equipment, spaces, or vehicles",
          suggestedRevenue: ["marketplace_fee", "transaction_fee", "subscription"],
        },
      },
      {
        id: "mkt-b2b",
        name: "B2B Marketplace",
        description: "Wholesale, supply chain, and business sourcing",
        products: [
          { id: "supplier-directory", name: "Supplier Directory", description: "Searchable catalog of verified suppliers" },
          { id: "rfq", name: "Request for Quotes", description: "Submit and compare supplier quotes" },
          { id: "bulk-ordering", name: "Bulk Ordering", description: "Volume pricing and purchase orders" },
          { id: "compliance-docs", name: "Compliance & Docs", description: "Certificates, contracts, and compliance tracking" },
          { id: "order-tracking", name: "Order Tracking", description: "End-to-end supply chain visibility" },
        ],
        defaults: {
          problemStatement: "Businesses waste time sourcing suppliers through cold calls and trade shows with no transparency on pricing",
          solution: "A B2B marketplace with supplier discovery, quote comparison, and streamlined procurement",
          targetCustomer: "Procurement teams, small manufacturers, and wholesale buyers",
          suggestedRevenue: ["marketplace_fee", "subscription", "transaction_fee"],
        },
      },
    ],
  },

  // ── Professional Services ──
  {
    id: "services",
    name: "Professional Services",
    description: "Service-based businesses and practices",
    icon: Briefcase,
    verticals: [
      {
        id: "svc-consulting",
        name: "Consulting & Coaching",
        description: "Business consulting, life coaching, advisory",
        products: [
          { id: "booking", name: "Session Booking", description: "Schedule and manage client sessions" },
          { id: "client-portal", name: "Client Portal", description: "Shared workspace with documents and progress" },
          { id: "packages", name: "Service Packages", description: "Bundled sessions and retainer plans" },
          { id: "intake-forms", name: "Intake Forms", description: "Client onboarding questionnaires" },
          { id: "video-sessions", name: "Video Sessions", description: "Built-in video calls for remote sessions" },
        ],
        defaults: {
          problemStatement: "Consultants juggle multiple tools for scheduling, billing, and client management",
          solution: "An all-in-one platform for client booking, session management, and recurring billing",
          targetCustomer: "Independent consultants, coaches, and advisory professionals",
          suggestedRevenue: ["subscription", "one_time", "consulting"],
        },
      },
      {
        id: "svc-agency",
        name: "Creative Agency",
        description: "Design, marketing, development agencies",
        products: [
          { id: "project-management", name: "Project Management", description: "Track projects, tasks, and deliverables" },
          { id: "client-approvals", name: "Client Approvals", description: "Review and approve creative work" },
          { id: "time-billing", name: "Time & Billing", description: "Track hours and generate invoices" },
          { id: "portfolio", name: "Portfolio Showcase", description: "Display work samples and case studies" },
          { id: "proposals", name: "Proposals & Contracts", description: "Create and send project proposals" },
        ],
        defaults: {
          problemStatement: "Agencies lose profitability tracking projects across disconnected tools for PM, billing, and client communication",
          solution: "A unified agency platform with project management, time tracking, approvals, and invoicing",
          targetCustomer: "Creative, marketing, and development agencies with 2-30 team members",
          suggestedRevenue: ["subscription", "consulting"],
        },
      },
      {
        id: "svc-legal",
        name: "Legal Services",
        description: "Law firms, legal tech, document management",
        products: [
          { id: "case-management", name: "Case Management", description: "Track cases, deadlines, and court dates" },
          { id: "document-automation", name: "Document Automation", description: "Generate legal documents from templates" },
          { id: "client-intake", name: "Client Intake", description: "Online intake forms and conflict checks" },
          { id: "time-tracking", name: "Time Tracking", description: "Billable hours tracking and reporting" },
          { id: "secure-sharing", name: "Secure Document Sharing", description: "Encrypted file sharing with clients" },
        ],
        defaults: {
          problemStatement: "Law firms rely on outdated, expensive software for case management and document handling",
          solution: "A modern legal practice management platform with document automation and client collaboration",
          targetCustomer: "Solo attorneys, small law firms, and legal consultants",
          suggestedRevenue: ["subscription", "pay_per_use"],
        },
      },
    ],
  },

  // ── Content & Education ──
  {
    id: "content",
    name: "Content & Education",
    description: "Knowledge products, media, and communities",
    icon: GraduationCap,
    verticals: [
      {
        id: "cnt-courses",
        name: "Online Courses",
        description: "Video courses, cohort-based programs",
        products: [
          { id: "course-builder", name: "Course Builder", description: "Create structured lessons with video, text, and quizzes" },
          { id: "student-progress", name: "Student Progress", description: "Track completion, grades, and engagement" },
          { id: "certificates", name: "Certificates", description: "Issue completion and achievement certificates" },
          { id: "community", name: "Student Community", description: "Discussion forums and peer interaction" },
          { id: "drip-content", name: "Drip Content", description: "Schedule content release over time" },
        ],
        defaults: {
          problemStatement: "Course creators are locked into platforms that take large revenue cuts and limit branding",
          solution: "A self-hosted course platform with full branding control, student management, and low fees",
          targetCustomer: "Online educators, subject experts, and training professionals",
          suggestedRevenue: ["one_time", "subscription", "freemium"],
        },
      },
      {
        id: "cnt-membership",
        name: "Membership & Community",
        description: "Paid communities, member-only content",
        products: [
          { id: "member-area", name: "Members Area", description: "Gated content and exclusive resources" },
          { id: "discussion", name: "Discussion Forums", description: "Community conversations and Q&A" },
          { id: "events", name: "Events & Webinars", description: "Schedule and host member events" },
          { id: "tiers", name: "Membership Tiers", description: "Multiple access levels with different benefits" },
          { id: "directory", name: "Member Directory", description: "Searchable member profiles and networking" },
        ],
        defaults: {
          problemStatement: "Community builders rely on social media platforms they don't own, with algorithms that limit reach",
          solution: "A branded membership platform with gated content, discussions, events, and recurring billing",
          targetCustomer: "Creators, thought leaders, and niche community builders",
          suggestedRevenue: ["subscription", "freemium"],
        },
      },
      {
        id: "cnt-media",
        name: "Media & Publishing",
        description: "Newsletters, blogs, podcasts, digital media",
        products: [
          { id: "content-cms", name: "Content CMS", description: "Write, schedule, and publish content" },
          { id: "newsletter", name: "Newsletter", description: "Email newsletter with subscriber management" },
          { id: "paywall", name: "Paywall", description: "Premium content behind a subscription" },
          { id: "podcast", name: "Podcast Hosting", description: "Host and distribute podcast episodes" },
          { id: "analytics", name: "Audience Analytics", description: "Reader engagement and growth metrics" },
        ],
        defaults: {
          problemStatement: "Independent publishers lack affordable tools to monetize their audience directly",
          solution: "A publishing platform with newsletter, paywall, and audience analytics built in",
          targetCustomer: "Writers, journalists, podcasters, and independent media creators",
          suggestedRevenue: ["subscription", "advertising", "sponsorship"],
        },
      },
    ],
  },

  // ── Creative & Design ──
  {
    id: "creative",
    name: "Creative & Design",
    description: "Design tools, creative marketplaces, and portfolios",
    icon: Palette,
    verticals: [
      {
        id: "cre-portfolio",
        name: "Portfolio & Showcase",
        description: "Creative portfolios and client galleries",
        products: [
          { id: "portfolio-site", name: "Portfolio Website", description: "Showcase creative work with galleries and case studies" },
          { id: "client-proofing", name: "Client Proofing", description: "Share and get approval on creative work" },
          { id: "contact-booking", name: "Contact & Booking", description: "Inquiry forms and project booking" },
          { id: "testimonials", name: "Testimonials", description: "Collect and display client reviews" },
        ],
        defaults: {
          problemStatement: "Creatives need a professional online presence but lack the time and skills to build custom websites",
          solution: "A portfolio platform with beautiful templates, client proofing, and lead capture",
          targetCustomer: "Photographers, designers, artists, and creative freelancers",
          suggestedRevenue: ["subscription", "freemium"],
        },
      },
      {
        id: "cre-assets",
        name: "Asset Marketplace",
        description: "Sell design assets, templates, and creative tools",
        products: [
          { id: "asset-store", name: "Asset Store", description: "Browse and purchase design assets" },
          { id: "preview-system", name: "Preview System", description: "Live previews and demos of assets" },
          { id: "licensing", name: "Licensing System", description: "Manage personal vs. commercial licenses" },
          { id: "creator-payouts", name: "Creator Payouts", description: "Automated royalty payments to contributors" },
          { id: "collections", name: "Collections & Bundles", description: "Curated sets of related assets" },
        ],
        defaults: {
          problemStatement: "Design asset creators lack a platform that offers fair royalties and good discovery for their work",
          solution: "A curated marketplace for design assets with fair creator payouts and built-in licensing",
          targetCustomer: "Graphic designers and developers buying/selling templates, icons, fonts, and UI kits",
          suggestedRevenue: ["marketplace_fee", "licensing", "subscription"],
        },
      },
    ],
  },

  // ── Custom / Other ──
  {
    id: "custom",
    name: "Other / Custom",
    description: "Start from scratch — describe your idea",
    icon: Sparkles,
    verticals: [],
  },
];
