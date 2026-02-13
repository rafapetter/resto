"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  AutonomyCategory,
  ApprovalLevel,
} from "@/lib/autonomy/types";
import {
  Brain,
  Code,
  Rocket,
  Plug,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  preferences: Record<AutonomyCategory, ApprovalLevel>;
  onChange: (
    category: AutonomyCategory,
    level: ApprovalLevel,
  ) => void;
};

const LEVELS: {
  value: ApprovalLevel;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    value: "full_auto",
    label: "Full Auto",
    shortLabel: "Auto",
    description: "Resto acts immediately without asking. Best for low-risk, routine tasks.",
  },
  {
    value: "notify_after",
    label: "Notify After",
    shortLabel: "Notify",
    description: "Resto acts first, then tells you what it did. You can review and undo.",
  },
  {
    value: "quick_confirm",
    label: "Quick Confirm",
    shortLabel: "Quick",
    description: "Resto asks for a quick yes/no before acting. Fast but you stay in the loop.",
  },
  {
    value: "detailed_approval",
    label: "Detailed Approval",
    shortLabel: "Detail",
    description: "Resto shows a detailed plan for your review before taking action.",
  },
  {
    value: "manual_only",
    label: "Manual Only",
    shortLabel: "Manual",
    description: "Resto only advises — you take all actions yourself. Maximum control.",
  },
];

const CATEGORIES: {
  key: AutonomyCategory;
  label: string;
  description: string;
  examples: string;
  icon: LucideIcon;
}[] = [
  {
    key: "knowledge_management",
    label: "Knowledge Management",
    description: "Managing docs, research, and business context",
    examples: "Saving meeting notes, updating project docs, researching competitors",
    icon: Brain,
  },
  {
    key: "code_generation",
    label: "Code Generation",
    description: "Writing and generating application code",
    examples: "Creating components, writing API routes, fixing bugs, adding tests",
    icon: Code,
  },
  {
    key: "deployment",
    label: "Deployment",
    description: "Deploying code and managing infrastructure",
    examples: "Pushing to production, configuring domains, scaling servers",
    icon: Rocket,
  },
  {
    key: "integrations",
    label: "Integrations",
    description: "Connecting third-party services and APIs",
    examples: "Setting up Stripe, connecting email providers, configuring analytics",
    icon: Plug,
  },
  {
    key: "communications",
    label: "Communications",
    description: "Sending emails, messages, and notifications",
    examples: "Sending customer emails, posting announcements, triggering notifications",
    icon: MessageSquare,
  },
  {
    key: "financial",
    label: "Financial",
    description: "Transactions, payments, and billing changes",
    examples: "Updating pricing, processing refunds, modifying subscription plans",
    icon: DollarSign,
  },
];

export function AutonomyPreferences({ preferences, onChange }: Props) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Set your autonomy preferences</h2>
        <p className="text-sm text-muted-foreground">
          Control how much freedom Resto has for each type of action. You can
          change these anytime in settings.
        </p>
      </div>
      <div className="grid gap-3">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.key}
            category={cat}
            level={preferences[cat.key]}
            onSelect={(level) => onChange(cat.key, level)}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Tip: Start conservative and grant more autonomy as you build trust with
        Resto.
      </p>
    </div>
  );
}

function CategoryCard({
  category,
  level,
  onSelect,
}: {
  category: (typeof CATEGORIES)[number];
  level: ApprovalLevel;
  onSelect: (level: ApprovalLevel) => void;
}) {
  const Icon = category.icon;
  const selectedLevel = LEVELS.find((l) => l.value === level);

  return (
    <Card>
      <CardContent className="grid gap-3 py-4">
        {/* Header row: icon + label + description */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{category.label}</p>
            <p className="text-xs text-muted-foreground">
              {category.description}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70 italic">
              e.g. {category.examples}
            </p>
          </div>
        </div>

        {/* Level selector */}
        <div className="flex gap-1">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => onSelect(l.value)}
              className={cn(
                "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                level === l.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span className="hidden sm:inline">{l.label}</span>
              <span className="sm:hidden">{l.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Selected level description */}
        {selectedLevel && (
          <p className="text-xs text-muted-foreground">
            {selectedLevel.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
