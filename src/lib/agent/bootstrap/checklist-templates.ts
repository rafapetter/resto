import { INDUSTRIES } from "@/components/onboarding/template-catalog";
import type { TemplateSelections } from "@/components/onboarding/steps/template-selection";

export type ChecklistTemplate = {
  title: string;
  description: string;
  stage: "plan" | "build" | "launch" | "grow";
  sortOrder: number;
};

// ─── Base checklist (every project) ─────────────────────────────────

const BASE_CHECKLIST: ChecklistTemplate[] = [
  // Plan
  { title: "Define core value proposition", description: "Articulate what makes your product unique and why customers should choose it", stage: "plan", sortOrder: 10 },
  { title: "Map out customer segments", description: "Identify and prioritize target customer groups with their needs and pain points", stage: "plan", sortOrder: 20 },
  { title: "Validate revenue model", description: "Confirm pricing strategy and revenue streams with early customer feedback", stage: "plan", sortOrder: 30 },
  { title: "Create product roadmap", description: "Outline MVP features and future phases with priorities and dependencies", stage: "plan", sortOrder: 40 },
  // Build
  { title: "Set up development environment", description: "Configure project repo, CI/CD pipeline, and development tools", stage: "build", sortOrder: 100 },
  { title: "Design core UI/UX", description: "Create wireframes and visual designs for the main user flows", stage: "build", sortOrder: 110 },
  { title: "Build MVP core features", description: "Implement the minimum set of features needed to deliver value", stage: "build", sortOrder: 120 },
  { title: "Set up authentication & security", description: "Implement user auth, data protection, and security best practices", stage: "build", sortOrder: 130 },
  // Launch
  { title: "Set up domain & hosting", description: "Register domain, configure DNS, and set up production hosting", stage: "launch", sortOrder: 200 },
  { title: "Configure payment processing", description: "Integrate payment gateway and set up billing flows", stage: "launch", sortOrder: 210 },
  { title: "Soft launch to beta users", description: "Release to a small group, gather feedback, and fix critical issues", stage: "launch", sortOrder: 220 },
  { title: "Prepare marketing assets", description: "Create landing page, launch email, and social media content", stage: "launch", sortOrder: 230 },
  // Grow
  { title: "Set up analytics & monitoring", description: "Configure user analytics, error tracking, and performance monitoring", stage: "grow", sortOrder: 300 },
  { title: "Gather and act on user feedback", description: "Collect structured feedback and prioritize improvements", stage: "grow", sortOrder: 310 },
  { title: "Plan feature iterations", description: "Analyze usage data and plan the next round of features", stage: "grow", sortOrder: 320 },
  { title: "Build growth channels", description: "Identify and test customer acquisition channels that scale", stage: "grow", sortOrder: 330 },
];

// ─── Generate product-specific checklist items ──────────────────────

function productItems(template: TemplateSelections): ChecklistTemplate[] {
  const industry = INDUSTRIES.find((i) => i.id === template.industryId);
  const vertical = industry?.verticals.find(
    (v) => v.id === template.verticalId
  );
  if (!vertical) return [];

  const items: ChecklistTemplate[] = [];
  let order = 140; // After base build items (100-130)

  for (const productId of template.productIds) {
    const product = vertical.products.find((p) => p.id === productId);
    if (!product) continue;

    items.push({
      title: `Design ${product.name}`,
      description: `Create UI designs and user flows for ${product.name}: ${product.description}`,
      stage: "build",
      sortOrder: order++,
    });
    items.push({
      title: `Implement ${product.name}`,
      description: `Build the ${product.name} feature — ${product.description}`,
      stage: "build",
      sortOrder: order++,
    });
    items.push({
      title: `Test ${product.name}`,
      description: `QA and test ${product.name} with realistic scenarios`,
      stage: "build",
      sortOrder: order++,
    });
  }

  return items;
}

// ─── Public API ─────────────────────────────────────────────────────

export function generateChecklist(
  template: TemplateSelections,
): ChecklistTemplate[] {
  return [...BASE_CHECKLIST, ...productItems(template)].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}
