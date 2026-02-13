"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChipSelect,
  EMPTY_MULTI_SELECT,
  type ChipOption,
  type MultiSelectValue,
} from "../chip-select";
import { REVENUE_OPTIONS } from "../template-catalog";

// ─── Predefined options ─────────────────────────────────────────────

const INDUSTRY_OPTIONS: ChipOption[] = [
  { id: "saas", label: "SaaS" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "marketplace", label: "Marketplace" },
  { id: "fintech", label: "Fintech" },
  { id: "healthtech", label: "Health & Wellness" },
  { id: "edtech", label: "Education" },
  { id: "food_bev", label: "Food & Beverage" },
  { id: "real_estate", label: "Real Estate" },
  { id: "travel", label: "Travel & Hospitality" },
  { id: "media", label: "Media & Entertainment" },
  { id: "professional_services", label: "Professional Services" },
  { id: "creative", label: "Creative & Design" },
  { id: "logistics", label: "Logistics & Supply Chain" },
  { id: "hr", label: "HR & Recruiting" },
  { id: "legal", label: "Legal" },
];

const PROBLEM_OPTIONS: ChipOption[] = [
  { id: "manual_processes", label: "Manual / repetitive processes" },
  { id: "no_online_presence", label: "No online presence" },
  { id: "poor_ux", label: "Poor customer experience" },
  { id: "data_scattered", label: "Data scattered across tools" },
  { id: "high_costs", label: "High operational costs" },
  { id: "slow_growth", label: "Slow customer acquisition" },
  { id: "no_analytics", label: "No analytics or insights" },
  { id: "communication_gap", label: "Communication gaps" },
  { id: "scaling", label: "Trouble scaling operations" },
  { id: "compliance", label: "Compliance & regulation burden" },
];

const SOLUTION_OPTIONS: ChipOption[] = [
  { id: "automation", label: "Automate workflows" },
  { id: "platform", label: "All-in-one platform" },
  { id: "ai_assistant", label: "AI-powered assistant" },
  { id: "self_service", label: "Self-service portal" },
  { id: "analytics_dashboard", label: "Analytics dashboard" },
  { id: "mobile_app", label: "Mobile-first app" },
  { id: "integrations", label: "Integrations hub" },
  { id: "marketplace_platform", label: "Marketplace / matching" },
  { id: "content_platform", label: "Content platform" },
  { id: "booking_system", label: "Booking / scheduling system" },
];

const CUSTOMER_OPTIONS: ChipOption[] = [
  { id: "smb", label: "Small businesses" },
  { id: "enterprise", label: "Enterprise companies" },
  { id: "freelancers", label: "Freelancers & solopreneurs" },
  { id: "consumers", label: "Individual consumers" },
  { id: "developers", label: "Developers & tech teams" },
  { id: "creators", label: "Content creators" },
  { id: "students", label: "Students & educators" },
  { id: "healthcare_pros", label: "Healthcare professionals" },
  { id: "agencies", label: "Agencies & consultancies" },
  { id: "nonprofits", label: "Non-profits & NGOs" },
];

// ─── Data type ──────────────────────────────────────────────────────

export type BusinessInfoData = {
  businessName: string;
  industry: MultiSelectValue;
  problemStatement: MultiSelectValue;
  solution: MultiSelectValue;
  targetCustomer: MultiSelectValue;
  revenueModels: string[];
};

export const EMPTY_BUSINESS_INFO: BusinessInfoData = {
  businessName: "",
  industry: { ...EMPTY_MULTI_SELECT },
  problemStatement: { ...EMPTY_MULTI_SELECT },
  solution: { ...EMPTY_MULTI_SELECT },
  targetCustomer: { ...EMPTY_MULTI_SELECT },
  revenueModels: [],
};

// ─── Revenue chip helper (same as template-catalog options) ─────────

const REVENUE_CHIP_OPTIONS: ChipOption[] = REVENUE_OPTIONS.map((r) => ({
  id: r.id,
  label: r.label,
}));

// ─── Component ──────────────────────────────────────────────────────

type Props = {
  data: BusinessInfoData;
  onChange: (data: BusinessInfoData) => void;
};

export function BusinessInfo({ data, onChange }: Props) {
  function updateField(field: keyof BusinessInfoData, value: MultiSelectValue) {
    onChange({ ...data, [field]: value });
  }

  function toggleRevenue(id: string) {
    const next = data.revenueModels.includes(id)
      ? data.revenueModels.filter((r) => r !== id)
      : [...data.revenueModels, id];
    onChange({ ...data, revenueModels: next });
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Tell us about your business</h2>
        <p className="text-sm text-muted-foreground">
          Help Resto understand your vision. Select what applies and add your
          own details. You can always refine this later.
        </p>
      </div>
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="businessName">Business name *</Label>
          <Input
            id="businessName"
            placeholder="e.g. Acme Analytics"
            value={data.businessName}
            onChange={(e) =>
              onChange({ ...data, businessName: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label>Industry</Label>
          <ChipSelect
            options={INDUSTRY_OPTIONS}
            value={data.industry}
            onChange={(v) => updateField("industry", v)}
            placeholder="Other industry..."
          />
        </div>

        <div className="grid gap-2">
          <Label>What problem are you solving? *</Label>
          <ChipSelect
            options={PROBLEM_OPTIONS}
            value={data.problemStatement}
            onChange={(v) => updateField("problemStatement", v)}
            placeholder="Describe the problem in your own words..."
            multiline
          />
        </div>

        <div className="grid gap-2">
          <Label>How does your product solve it?</Label>
          <ChipSelect
            options={SOLUTION_OPTIONS}
            value={data.solution}
            onChange={(v) => updateField("solution", v)}
            placeholder="Describe your solution in your own words..."
            multiline
          />
        </div>

        <div className="grid gap-2">
          <Label>Who is your target customer?</Label>
          <ChipSelect
            options={CUSTOMER_OPTIONS}
            value={data.targetCustomer}
            onChange={(v) => updateField("targetCustomer", v)}
            placeholder="Describe your target audience..."
          />
        </div>

        <div className="grid gap-2">
          <Label>Revenue & business model (select all that apply)</Label>
          <ChipSelect
            options={REVENUE_CHIP_OPTIONS}
            value={{
              selected: data.revenueModels,
              custom: "",
            }}
            onChange={(v) => {
              // Revenue models only uses the selected array (no custom text)
              onChange({ ...data, revenueModels: v.selected });
            }}
            placeholder="Other revenue model..."
          />
        </div>
      </div>
    </div>
  );
}
