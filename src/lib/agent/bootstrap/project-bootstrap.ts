import { db } from "@/server/db";
import { checklistItems } from "@/server/db/schema";
import { KnowledgeBaseService } from "@/lib/knowledge/service";
import { resolveMultiSelect } from "@/lib/utils/multi-select";
import type { MultiSelectValue } from "@/lib/utils/multi-select";
import type { AutonomyCategory, ApprovalLevel } from "@/lib/autonomy/types";
import { INDUSTRIES, REVENUE_OPTIONS } from "@/components/onboarding/template-catalog";
import type { TemplateSelections } from "@/components/onboarding/steps/template-selection";
import { generateChecklist } from "./checklist-templates";

type BusinessInfoData = {
  businessName: string;
  industry: MultiSelectValue;
  problemStatement: MultiSelectValue;
  solution: MultiSelectValue;
  targetCustomer: MultiSelectValue;
  revenueModels: string[];
};

type BootstrapParams = {
  projectId: string;
  tenantId: string;
  template: TemplateSelections;
  businessInfo: BusinessInfoData;
  autonomyPreferences: Record<AutonomyCategory, ApprovalLevel>;
};

const LEVEL_LABELS: Record<ApprovalLevel, string> = {
  full_auto: "Full Auto",
  notify_after: "Notify After",
  quick_confirm: "Quick Confirm",
  detailed_approval: "Detailed Approval",
  manual_only: "Manual Only",
};

const CATEGORY_LABELS: Record<AutonomyCategory, string> = {
  knowledge_management: "Knowledge Management",
  code_generation: "Code Generation",
  deployment: "Deployment",
  integrations: "Integrations",
  communications: "Communications",
  financial: "Financial",
};

// ─── Build the KB seed document ─────────────────────────────────────

function buildBusinessProfile(params: BootstrapParams): string {
  const { template, businessInfo, autonomyPreferences } = params;

  const industry = INDUSTRIES.find((i) => i.id === template.industryId);
  const vertical = industry?.verticals.find(
    (v) => v.id === template.verticalId
  );
  const selectedProducts = vertical?.products.filter((p) =>
    template.productIds.includes(p.id)
  );

  const revenueMap = Object.fromEntries(
    REVENUE_OPTIONS.map((r) => [r.id, r.label])
  );

  // Resolve MultiSelectValues — use id as fallback label
  const idMap = (ids: string[]) =>
    Object.fromEntries(ids.map((id) => [id, id.replace(/_/g, " ")]));

  const resolveField = (v: MultiSelectValue) =>
    resolveMultiSelect(v, idMap(v.selected)) || "Not specified";

  const lines: string[] = [
    `# Business Profile: ${businessInfo.businessName || "Untitled"}`,
    "",
    "## Industry & Vertical",
    `- Industry: ${industry?.name ?? "Custom"}`,
  ];

  if (vertical) {
    lines.push(`- Vertical: ${vertical.name}`);
  }

  const industryField = resolveField(businessInfo.industry);
  if (industryField !== "Not specified") {
    lines.push(`- Additional industries: ${industryField}`);
  }

  lines.push(
    "",
    "## Problem",
    resolveField(businessInfo.problemStatement),
    "",
    "## Solution",
    resolveField(businessInfo.solution),
    "",
    "## Target Customer",
    resolveField(businessInfo.targetCustomer),
  );

  if (businessInfo.revenueModels.length > 0) {
    const revenueLabels = businessInfo.revenueModels
      .map((id) => revenueMap[id] ?? id)
      .join(", ");
    lines.push("", "## Revenue Models", revenueLabels);
  }

  if (selectedProducts && selectedProducts.length > 0) {
    lines.push("", "## Selected Features");
    for (const p of selectedProducts) {
      lines.push(`- **${p.name}**: ${p.description}`);
    }
  }

  lines.push("", "## Autonomy Preferences");
  for (const [cat, level] of Object.entries(autonomyPreferences) as [
    AutonomyCategory,
    ApprovalLevel,
  ][]) {
    lines.push(`- ${CATEGORY_LABELS[cat]}: ${LEVEL_LABELS[level]}`);
  }

  return lines.join("\n");
}

// ─── Bootstrap ──────────────────────────────────────────────────────

export async function bootstrapProject(
  params: BootstrapParams,
): Promise<{ kbFileCount: number; checklistItemCount: number }> {
  const kb = new KnowledgeBaseService();

  // 1. Seed knowledge base
  const profileContent = buildBusinessProfile(params);
  const kbFiles = await kb.create({
    tenantId: params.tenantId,
    projectId: params.projectId,
    tier: "summary",
    title: `Business Profile: ${params.businessInfo.businessName || "New Project"}`,
    content: profileContent,
  });

  // 2. Generate and insert checklist
  const templates = generateChecklist(params.template);
  if (templates.length > 0) {
    await db.insert(checklistItems).values(
      templates.map((t) => ({
        tenantId: params.tenantId,
        projectId: params.projectId,
        title: t.title,
        description: t.description,
        stage: t.stage,
        sortOrder: t.sortOrder,
      })),
    );
  }

  return {
    kbFileCount: kbFiles.length,
    checklistItemCount: templates.length,
  };
}
