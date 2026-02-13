"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import {
  INDUSTRIES,
  type Industry,
  type Vertical,
  type Product,
} from "../template-catalog";

export type TemplateSelections = {
  industryId: string | null;
  verticalId: string | null;
  productIds: string[];
};

export const EMPTY_SELECTIONS: TemplateSelections = {
  industryId: null,
  verticalId: null,
  productIds: [],
};

type Props = {
  selections: TemplateSelections;
  onChange: (selections: TemplateSelections) => void;
};

// ─── Breadcrumb ─────────────────────────────────────────────────────

type BreadcrumbStep = "industry" | "vertical" | "features";

function Breadcrumb({
  active,
  industry,
  vertical,
  onNavigate,
}: {
  active: BreadcrumbStep;
  industry: Industry | undefined;
  vertical: Vertical | undefined;
  onNavigate: (step: BreadcrumbStep) => void;
}) {
  const steps: { key: BreadcrumbStep; label: string; enabled: boolean }[] = [
    { key: "industry", label: "Industry", enabled: true },
    {
      key: "vertical",
      label: industry?.name ?? "Vertical",
      enabled: !!industry && industry.verticals.length > 0,
    },
    {
      key: "features",
      label: vertical?.name ?? "Features",
      enabled: !!vertical,
    },
  ];

  return (
    <nav className="mb-5 flex items-center gap-1 text-sm">
      {steps.map((step, i) => {
        if (!step.enabled && step.key !== "industry") return null;
        const isCurrent = step.key === active;
        const isPast =
          (step.key === "industry" && active !== "industry") ||
          (step.key === "vertical" && active === "features");
        return (
          <div key={step.key} className="flex items-center gap-1">
            {i > 0 && steps[i - 1]?.enabled && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
            <button
              type="button"
              disabled={!isPast}
              onClick={() => isPast && onNavigate(step.key)}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                isCurrent && "bg-primary/10 text-primary",
                isPast &&
                  "cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground",
                !isCurrent && !isPast && "text-muted-foreground/50"
              )}
            >
              {step.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

// ─── Main component ─────────────────────────────────────────────────

export function TemplateSelection({ selections, onChange }: Props) {
  const industry = INDUSTRIES.find((i) => i.id === selections.industryId);
  const vertical = industry?.verticals.find(
    (v) => v.id === selections.verticalId
  );

  function handleBreadcrumbNav(step: BreadcrumbStep) {
    if (step === "industry") {
      onChange(EMPTY_SELECTIONS);
    } else if (step === "vertical") {
      onChange({ ...selections, verticalId: null, productIds: [] });
    }
  }

  // Determine active breadcrumb step
  const activeStep: BreadcrumbStep = !selections.industryId
    ? "industry"
    : !selections.verticalId ||
        (industry && industry.verticals.length === 0)
      ? "vertical"
      : "features";

  // Layer 1: Pick industry
  if (!selections.industryId) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumb
          active="industry"
          industry={undefined}
          vertical={undefined}
          onNavigate={handleBreadcrumbNav}
        />
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            What type of business are you building?
          </h2>
          <p className="text-sm text-muted-foreground">
            Select your industry to get tailored templates and suggestions.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind) => (
            <IndustryCard
              key={ind.id}
              industry={ind}
              onSelect={() =>
                onChange({
                  industryId: ind.id,
                  verticalId: ind.verticals.length === 0 ? "__custom__" : null,
                  productIds: [],
                })
              }
            />
          ))}
        </div>
      </div>
    );
  }

  // Layer 2: Pick vertical (skip for "custom" which has no verticals)
  if (!selections.verticalId && industry && industry.verticals.length > 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumb
          active="vertical"
          industry={industry}
          vertical={undefined}
          onNavigate={handleBreadcrumbNav}
        />
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Choose a vertical in{" "}
            <span className="text-primary">{industry.name}</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Pick the vertical that best matches your business.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {industry.verticals.map((vert) => (
            <VerticalCard
              key={vert.id}
              vertical={vert}
              onSelect={() =>
                onChange({ ...selections, verticalId: vert.id, productIds: [] })
              }
            />
          ))}
        </div>
      </div>
    );
  }

  // Layer 3: Pick products (multi-select)
  if (vertical) {
    return (
      <div className="mx-auto max-w-3xl">
        <Breadcrumb
          active="features"
          industry={industry}
          vertical={vertical}
          onNavigate={handleBreadcrumbNav}
        />
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            What will your product include?
          </h2>
          <p className="text-sm text-muted-foreground">
            Select all the features and modules you want for your{" "}
            <span className="font-medium text-foreground">
              {vertical.name}
            </span>{" "}
            business.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {vertical.products.map((product) => {
            const selected = selections.productIds.includes(product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={selected}
                onToggle={() => {
                  const next = selected
                    ? selections.productIds.filter((id) => id !== product.id)
                    : [...selections.productIds, product.id];
                  onChange({ ...selections, productIds: next });
                }}
              />
            );
          })}
        </div>
        {selections.productIds.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            {selections.productIds.length} feature
            {selections.productIds.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>
    );
  }

  // Custom industry (no verticals) — show a simple confirmation
  return (
    <div className="mx-auto max-w-lg">
      <Breadcrumb
        active="vertical"
        industry={industry}
        vertical={undefined}
        onNavigate={handleBreadcrumbNav}
      />
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Start from scratch</h2>
        <p className="text-sm text-muted-foreground">
          No template selected — you&apos;ll describe your idea in the next step
          and Resto will help shape it.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function IndustryCard({
  industry,
  onSelect,
}: {
  industry: Industry;
  onSelect: () => void;
}) {
  const Icon = industry.icon;
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onSelect}
    >
      <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="font-medium">{industry.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {industry.description}
          </p>
        </div>
        {industry.verticals.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {industry.verticals.length} verticals
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function VerticalCard({
  vertical,
  onSelect,
}: {
  vertical: Vertical;
  onSelect: () => void;
}) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onSelect}
    >
      <CardContent className="pt-5">
        <p className="font-medium">{vertical.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {vertical.description}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {vertical.products.length} features available
        </p>
      </CardContent>
    </Card>
  );
}

function ProductCard({
  product,
  isSelected,
  onToggle,
}: {
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isSelected && "border-primary ring-2 ring-primary/20"
      )}
      onClick={onToggle}
    >
      <CardContent className="flex items-start gap-3 pt-4">
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-xs transition-colors",
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/30"
          )}
        >
          {isSelected && "✓"}
        </div>
        <div>
          <p className="text-sm font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
