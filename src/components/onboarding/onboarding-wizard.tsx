"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { DEFAULT_AUTONOMY } from "@/lib/autonomy/types";
import type { AutonomyCategory, ApprovalLevel } from "@/lib/autonomy/types";
import { hasMultiSelectContent } from "./chip-select";
import { INDUSTRIES } from "./template-catalog";
import {
  TemplateSelection,
  EMPTY_SELECTIONS,
  type TemplateSelections,
} from "./steps/template-selection";
import {
  BusinessInfo,
  EMPTY_BUSINESS_INFO,
  type BusinessInfoData,
} from "./steps/business-info";
import { AutonomyPreferences } from "./steps/autonomy-preferences";
import { ReviewLaunch } from "./steps/review-launch";

type WizardState = {
  projectId: string | null;
  currentStep: number;
  template: TemplateSelections;
  businessInfo: BusinessInfoData;
  autonomyPreferences: Record<AutonomyCategory, ApprovalLevel>;
};

const INITIAL_STATE: WizardState = {
  projectId: null,
  currentStep: 0,
  template: { ...EMPTY_SELECTIONS },
  businessInfo: { ...EMPTY_BUSINESS_INFO },
  autonomyPreferences: { ...DEFAULT_AUTONOMY },
};

const STEP_LABELS = ["Template", "Business Info", "Autonomy", "Review"];

export function OnboardingWizard() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [isSaving, setIsSaving] = useState(false);

  const createProject = useMutation(trpc.projects.create.mutationOptions({}));
  const updateProject = useMutation(trpc.projects.update.mutationOptions({}));
  const updateStep = useMutation(
    trpc.onboarding.updateStep.mutationOptions({})
  );
  const updateAutonomy = useMutation(
    trpc.settings.updateAutonomy.mutationOptions({})
  );
  const bootstrap = useMutation(trpc.projects.bootstrap.mutationOptions({}));

  /** Build smart autonomy defaults from template + business info */
  function computeAutonomyDefaults(): Record<AutonomyCategory, ApprovalLevel> {
    const prefs = { ...DEFAULT_AUTONOMY };
    const industryId = state.template.industryId;
    const industries = state.businessInfo.industry.selected;
    const revenueModels = state.businessInfo.revenueModels;
    const problems = state.businessInfo.problemStatement.selected;
    const solutions = state.businessInfo.solution.selected;

    // Financial-heavy businesses → stricter financial controls
    const hasFinancialRisk =
      industryId === "fintech" ||
      industries.includes("fintech") ||
      revenueModels.some((r) =>
        ["transaction_fee", "marketplace_fee", "pay_per_use"].includes(r)
      );
    if (hasFinancialRisk) {
      prefs.financial = "manual_only";
      prefs.communications = "detailed_approval";
    }

    // E-commerce / marketplace → moderate deployment & integration trust
    const isCommerce =
      industryId === "ecommerce" ||
      industryId === "marketplace" ||
      industries.includes("ecommerce") ||
      industries.includes("marketplace");
    if (isCommerce) {
      prefs.deployment = "quick_confirm";
      prefs.integrations = "quick_confirm";
    }

    // SaaS / tech-savvy → trust code gen & knowledge more
    const isTech =
      industryId === "saas" ||
      industries.includes("saas") ||
      solutions.includes("platform") ||
      solutions.includes("ai_assistant");
    if (isTech) {
      prefs.code_generation = "notify_after";
      prefs.knowledge_management = "full_auto";
    }

    // Content / education → more trust on communications
    const isContent =
      industryId === "content_education" ||
      industries.includes("edtech") ||
      industries.includes("media") ||
      solutions.includes("content_platform");
    if (isContent) {
      prefs.communications = "quick_confirm";
      prefs.knowledge_management = "full_auto";
    }

    // If user selected automation-focused solutions, trust more
    const wantsAutomation =
      solutions.includes("automation") ||
      problems.includes("manual_processes");
    if (wantsAutomation) {
      prefs.knowledge_management = "full_auto";
      if (prefs.code_generation === "detailed_approval") {
        prefs.code_generation = "quick_confirm";
      }
    }

    return prefs;
  }

  /** Resolve current industry + vertical from selections */
  function getSelectedVertical() {
    const industry = INDUSTRIES.find(
      (i) => i.id === state.template.industryId
    );
    const vertical = industry?.verticals.find(
      (v) => v.id === state.template.verticalId
    );
    return { industry, vertical };
  }

  function canProceed(): boolean {
    switch (state.currentStep) {
      case 0: {
        const { industryId, verticalId } = state.template;
        if (!industryId) return false;
        const ind = INDUSTRIES.find((i) => i.id === industryId);
        // Custom has no verticals — just need industry selected
        if (ind && ind.verticals.length === 0) return true;
        // Otherwise need vertical + at least 1 product
        return !!verticalId && state.template.productIds.length > 0;
      }
      case 1:
        return !!(
          state.businessInfo.businessName.trim() &&
          hasMultiSelectContent(state.businessInfo.problemStatement)
        );
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  }

  async function handleNext() {
    if (!canProceed()) return;
    setIsSaving(true);

    try {
      if (state.currentStep === 0) {
        let projectId = state.projectId;
        const { industry, vertical } = getSelectedVertical();
        const projectName = vertical?.name ?? industry?.name ?? "New Project";

        if (!projectId) {
          const project = await createProject.mutateAsync({
            name: projectName,
            templateId: state.template.industryId ?? undefined,
          });
          projectId = project.id;
          await updateProject.mutateAsync({
            id: projectId,
            status: "onboarding",
          });
          setState((prev) => ({ ...prev, projectId }));
        }

        await updateStep.mutateAsync({
          projectId,
          step: "template_selection",
          data: state.template as unknown as Record<string, unknown>,
        });

        // Pre-fill business info from vertical defaults (only if form is untouched)
        if (vertical?.defaults) {
          const bi = state.businessInfo;
          const hasEdits =
            bi.businessName.trim() ||
            hasMultiSelectContent(bi.industry) ||
            hasMultiSelectContent(bi.problemStatement) ||
            hasMultiSelectContent(bi.solution) ||
            hasMultiSelectContent(bi.targetCustomer) ||
            bi.revenueModels.length > 0;

          if (!hasEdits) {
            setState((prev) => ({
              ...prev,
              businessInfo: {
                businessName: "",
                industry: {
                  selected: industry ? [industry.id] : [],
                  custom: "",
                },
                problemStatement: {
                  selected: [],
                  custom: vertical.defaults.problemStatement,
                },
                solution: {
                  selected: [],
                  custom: vertical.defaults.solution,
                },
                targetCustomer: {
                  selected: [],
                  custom: vertical.defaults.targetCustomer,
                },
                revenueModels: vertical.defaults.suggestedRevenue,
              },
            }));
          }
        }
      }

      if (state.currentStep === 1 && state.projectId) {
        // Build a human-readable description from composite fields
        const problemText = state.businessInfo.problemStatement.custom.trim() ||
          state.businessInfo.problemStatement.selected.join(", ");
        const solutionText = state.businessInfo.solution.custom.trim() ||
          state.businessInfo.solution.selected.join(", ");
        await updateProject.mutateAsync({
          id: state.projectId,
          name: state.businessInfo.businessName.trim(),
          description: [problemText, solutionText]
            .filter(Boolean)
            .join(" — "),
        });
        await updateStep.mutateAsync({
          projectId: state.projectId,
          step: "business_info",
          data: state.businessInfo as unknown as Record<string, unknown>,
        });

        // Pre-fill autonomy preferences based on industry + business context
        const suggestedAutonomy = computeAutonomyDefaults();
        setState((prev) => ({
          ...prev,
          autonomyPreferences: suggestedAutonomy,
        }));
      }

      if (state.currentStep === 2 && state.projectId) {
        const entries = Object.entries(state.autonomyPreferences) as [
          AutonomyCategory,
          ApprovalLevel,
        ][];
        await Promise.all(
          entries.map(([category, level]) =>
            updateAutonomy.mutateAsync({
              projectId: state.projectId!,
              category,
              level,
            })
          )
        );
        await updateStep.mutateAsync({
          projectId: state.projectId,
          step: "integrations",
          data: state.autonomyPreferences as unknown as Record<
            string,
            unknown
          >,
        });
      }

      setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    } finally {
      setIsSaving(false);
    }
  }

  function handleBack() {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }

  async function handleLaunch() {
    if (!state.projectId) return;
    setIsSaving(true);

    try {
      await updateStep.mutateAsync({
        projectId: state.projectId,
        step: "review",
        data: {},
      });
      await updateStep.mutateAsync({
        projectId: state.projectId,
        step: "complete",
        data: {},
      });

      // Bootstrap: seed KB with business profile + generate checklist
      await bootstrap.mutateAsync({
        projectId: state.projectId,
        template: state.template,
        businessInfo: state.businessInfo,
        autonomyPreferences: state.autonomyPreferences as Record<string, string>,
      });

      await updateProject.mutateAsync({
        id: state.projectId,
        status: "active",
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.projects.list.queryKey(),
      });
      router.push(ROUTES.projectChat(state.projectId));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-4">
      <ProgressStepper currentStep={state.currentStep} />

      <div className="min-h-[400px] py-6">
        {state.currentStep === 0 && (
          <TemplateSelection
            selections={state.template}
            onChange={(template) => setState((prev) => ({ ...prev, template }))}
          />
        )}
        {state.currentStep === 1 && (
          <BusinessInfo
            data={state.businessInfo}
            onChange={(data) =>
              setState((prev) => ({ ...prev, businessInfo: data }))
            }
          />
        )}
        {state.currentStep === 2 && (
          <AutonomyPreferences
            preferences={state.autonomyPreferences}
            onChange={(category, level) =>
              setState((prev) => ({
                ...prev,
                autonomyPreferences: {
                  ...prev.autonomyPreferences,
                  [category]: level,
                },
              }))
            }
          />
        )}
        {state.currentStep === 3 && (
          <ReviewLaunch
            template={state.template}
            businessInfo={state.businessInfo}
            autonomyPreferences={state.autonomyPreferences}
            onEdit={(step) =>
              setState((prev) => ({ ...prev, currentStep: step }))
            }
            onLaunch={handleLaunch}
            isLaunching={isSaving}
          />
        )}
      </div>

      {state.currentStep < 3 && (
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={state.currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed() || isSaving}>
            {isSaving ? "Saving..." : "Continue"}
            {!isSaving && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}

function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-2">
      <div className="flex items-start">
        {STEP_LABELS.map((label, index) => (
          <div key={label} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  index < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index === currentStep
                      ? "border-primary text-primary"
                      : "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-xs whitespace-nowrap",
                  index <= currentStep
                    ? "font-medium text-foreground"
                    : "hidden text-muted-foreground sm:block"
                )}
              >
                {label}
              </span>
            </div>
            {index < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "mt-4 h-0.5 flex-1 mx-2",
                  index < currentStep ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
