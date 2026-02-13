"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { INDUSTRIES, REVENUE_OPTIONS } from "../template-catalog";
import type { MultiSelectValue } from "../chip-select";
import type { TemplateSelections } from "./template-selection";
import type { BusinessInfoData } from "./business-info";
import type { AutonomyCategory, ApprovalLevel } from "@/lib/autonomy/types";

type Props = {
  template: TemplateSelections;
  businessInfo: BusinessInfoData | null;
  autonomyPreferences: Record<AutonomyCategory, ApprovalLevel>;
  onEdit: (stepIndex: number) => void;
  onLaunch: () => void;
  isLaunching: boolean;
};

const LEVEL_LABELS: Record<ApprovalLevel, string> = {
  full_auto: "Full Auto",
  notify_after: "Notify After",
  quick_confirm: "Quick Confirm",
  detailed_approval: "Detailed Approval",
  manual_only: "Manual Only",
};

const CATEGORY_LABELS: Record<AutonomyCategory, string> = {
  knowledge_management: "Knowledge",
  code_generation: "Code",
  deployment: "Deployment",
  integrations: "Integrations",
  communications: "Communications",
  financial: "Financial",
};

export function ReviewLaunch({
  template,
  businessInfo,
  autonomyPreferences,
  onEdit,
  onLaunch,
  isLaunching,
}: Props) {
  const industry = INDUSTRIES.find((i) => i.id === template.industryId);
  const vertical = industry?.verticals.find(
    (v) => v.id === template.verticalId
  );
  const selectedProducts = vertical?.products.filter((p) =>
    template.productIds.includes(p.id)
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Review & launch</h2>
        <p className="text-sm text-muted-foreground">
          Everything looks good? Launch your project and start building with
          Resto.
        </p>
      </div>

      <div className="grid gap-4">
        {/* Template Selections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Template</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(0)}>
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Row
              label="Industry"
              value={industry?.name ?? "Custom"}
            />
            {vertical && (
              <Row label="Vertical" value={vertical.name} />
            )}
            {selectedProducts && selectedProducts.length > 0 && (
              <div className="flex gap-2 text-sm">
                <dt className="w-20 shrink-0 text-muted-foreground">
                  Features
                </dt>
                <dd className="flex flex-wrap gap-1">
                  {selectedProducts.map((p) => (
                    <Badge key={p.id} variant="secondary" className="text-xs">
                      {p.name}
                    </Badge>
                  ))}
                </dd>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Business Info
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {businessInfo ? (
              <dl className="grid gap-2 text-sm">
                <Row label="Name" value={businessInfo.businessName} />
                <MultiSelectRow label="Industry" value={businessInfo.industry} />
                <MultiSelectRow label="Problem" value={businessInfo.problemStatement} />
                <MultiSelectRow label="Solution" value={businessInfo.solution} />
                <MultiSelectRow label="Customer" value={businessInfo.targetCustomer} />
                {businessInfo.revenueModels.length > 0 && (
                  <div className="flex gap-2 text-sm">
                    <dt className="w-20 shrink-0 text-muted-foreground">
                      Revenue
                    </dt>
                    <dd className="flex flex-wrap gap-1">
                      {businessInfo.revenueModels.map((id) => {
                        const opt = REVENUE_OPTIONS.find((r) => r.id === id);
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {opt?.label ?? id}
                          </Badge>
                        );
                      })}
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                Not filled in yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Autonomy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Autonomy Preferences
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(
                Object.entries(autonomyPreferences) as [
                  AutonomyCategory,
                  ApprovalLevel,
                ][]
              ).map(([cat, level]) => (
                <div
                  key={cat}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <span className="text-muted-foreground">
                    {CATEGORY_LABELS[cat]}:
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {LEVEL_LABELS[level]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={onLaunch} disabled={isLaunching}>
          {isLaunching ? "Launching..." : "Launch Project"}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function MultiSelectRow({
  label,
  value,
}: {
  label: string;
  value: MultiSelectValue;
}) {
  const hasContent = value.selected.length > 0 || value.custom.trim();
  if (!hasContent) return null;

  return (
    <div className="flex gap-2 text-sm">
      <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="flex flex-wrap items-center gap-1">
        {value.selected.map((id) => (
          <Badge key={id} variant="secondary" className="text-xs">
            {id.replace(/_/g, " ")}
          </Badge>
        ))}
        {value.custom.trim() && (
          <span className="text-sm">{value.custom.trim()}</span>
        )}
      </dd>
    </div>
  );
}
