"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Check,
  Brain,
  Code,
  Rocket,
  Plug,
  MessageSquare,
  DollarSign,
} from "lucide-react";

// ─── Mock data ──────────────────────────────────────────────────────

const INDUSTRIES = [
  { id: "saas", name: "SaaS", emoji: "💻" },
  { id: "ecommerce", name: "E-commerce", emoji: "🛒" },
  { id: "food", name: "Food & Beverage", emoji: "🍽️" },
  { id: "fintech", name: "Fintech", emoji: "💳" },
  { id: "edtech", name: "EdTech", emoji: "📚" },
  { id: "health", name: "HealthTech", emoji: "🏥" },
];

const VERTICALS = [
  { id: "restaurant", name: "Restaurant" },
  { id: "cafe", name: "Café / Coffee Shop" },
  { id: "delivery", name: "Delivery-Only Kitchen" },
  { id: "catering", name: "Catering Service" },
];

const FEATURES = [
  { id: "ordering", name: "Online Ordering" },
  { id: "reservations", name: "Table Reservations" },
  { id: "menu", name: "Menu Management" },
  { id: "loyalty", name: "Loyalty Program" },
  { id: "inventory", name: "Inventory Tracking" },
  { id: "analytics", name: "Sales Analytics" },
];

const AUTONOMY_CATEGORIES = [
  { key: "knowledge", label: "Knowledge", icon: Brain },
  { key: "code", label: "Code Gen", icon: Code },
  { key: "deploy", label: "Deployment", icon: Rocket },
  { key: "integrations", label: "Integrations", icon: Plug },
  { key: "comms", label: "Comms", icon: MessageSquare },
  { key: "financial", label: "Financial", icon: DollarSign },
];

const LEVELS = [
  { value: "full_auto", label: "Auto", color: "bg-emerald-600 text-white" },
  { value: "notify", label: "Notify", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  { value: "quick", label: "Quick", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "detail", label: "Detail", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "manual", label: "Manual", color: "bg-muted text-muted-foreground" },
];

// ─── Sub-step types ─────────────────────────────────────────────────

type SubStep = "industry" | "vertical" | "features" | "autonomy" | "done";

type Props = {
  isPlaying: boolean;
  onComplete: () => void;
};

export function OnboardingPhase({ isPlaying, onComplete }: Props) {
  const [subStep, setSubStep] = useState<SubStep>("industry");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [autonomy, setAutonomy] = useState<Record<string, string>>({});
  const [launching, setLaunching] = useState(false);

  const advance = useCallback(() => {
    if (subStep === "industry") {
      setSelectedIndustry("food");
      setTimeout(() => setSubStep("vertical"), 600);
    } else if (subStep === "vertical") {
      setSelectedVertical("restaurant");
      setTimeout(() => setSubStep("features"), 600);
    } else if (subStep === "features") {
      setSelectedFeatures(["ordering", "reservations", "menu", "loyalty"]);
      setTimeout(() => setSubStep("autonomy"), 600);
    } else if (subStep === "autonomy") {
      setAutonomy({
        knowledge: "full_auto",
        code: "notify",
        deploy: "quick",
        integrations: "quick",
        comms: "detail",
        financial: "manual",
      });
      setTimeout(() => {
        setLaunching(true);
        setTimeout(onComplete, 1500);
      }, 1000);
    }
  }, [subStep, onComplete]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(advance, 1800);
    return () => clearTimeout(timer);
  }, [isPlaying, advance]);

  const stepIndex =
    subStep === "industry"
      ? 0
      : subStep === "vertical"
        ? 1
        : subStep === "features"
          ? 2
          : 3;

  const breadcrumbs = ["Industry", "Vertical", "Features", "Autonomy"];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {breadcrumbs.map((label, i) => (
          <span key={label} className="flex items-center gap-2">
            {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            <span
              className={cn(
                "rounded-full px-3 py-1 transition-all",
                i === stepIndex
                  ? "bg-emerald-600 font-medium text-white"
                  : i < stepIndex
                    ? "text-emerald-600"
                    : "text-muted-foreground"
              )}
            >
              {i < stepIndex ? <Check className="inline h-3 w-3" /> : null}{" "}
              {label}
            </span>
          </span>
        ))}
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {subStep === "industry" && "What industry are you in?"}
          {subStep === "vertical" && "What type of business?"}
          {subStep === "features" && "Select features to build"}
          {subStep === "autonomy" && "Set autonomy preferences"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {subStep === "industry" && "Pick the industry that best describes your business."}
          {subStep === "vertical" && "Choose your specific vertical within Food & Beverage."}
          {subStep === "features" && "Select the features you want Resto to build for you."}
          {subStep === "autonomy" && "Control how much freedom Resto has for each category."}
        </p>
      </div>

      {/* Content */}
      {subStep === "industry" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {INDUSTRIES.map((ind) => (
            <Card
              key={ind.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedIndustry === ind.id && "ring-2 ring-emerald-600"
              )}
              onClick={() => {
                setSelectedIndustry(ind.id);
                if (!isPlaying) setTimeout(() => setSubStep("vertical"), 400);
              }}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <span className="text-2xl">{ind.emoji}</span>
                <span className="text-sm font-medium">{ind.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {subStep === "vertical" && (
        <div className="grid grid-cols-2 gap-3">
          {VERTICALS.map((v) => (
            <Card
              key={v.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedVertical === v.id && "ring-2 ring-emerald-600"
              )}
              onClick={() => {
                setSelectedVertical(v.id);
                if (!isPlaying) setTimeout(() => setSubStep("features"), 400);
              }}
            >
              <CardContent className="p-4 text-center">
                <span className="text-sm font-medium">{v.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {subStep === "features" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f) => {
              const checked = selectedFeatures.includes(f.id);
              return (
                <Card
                  key={f.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    checked && "ring-2 ring-emerald-600"
                  )}
                  onClick={() => {
                    setSelectedFeatures((prev) =>
                      checked
                        ? prev.filter((id) => id !== f.id)
                        : [...prev, f.id]
                    );
                  }}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded border",
                        checked
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {checked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm font-medium">{f.name}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {!isPlaying && selectedFeatures.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={() => setSubStep("autonomy")}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      )}

      {subStep === "autonomy" && (
        <div className="space-y-4">
          {AUTONOMY_CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <cat.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="w-24 shrink-0 text-sm font-medium">
                {cat.label}
              </span>
              <div className="flex flex-1 gap-1">
                {LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() =>
                      setAutonomy((prev) => ({
                        ...prev,
                        [cat.key]: level.value,
                      }))
                    }
                    className={cn(
                      "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-all",
                      autonomy[cat.key] === level.value
                        ? level.color
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {!isPlaying && Object.keys(autonomy).length === 6 && (
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setLaunching(true);
                  setTimeout(onComplete, 1500);
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Launch Project
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Launching overlay */}
      {launching && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="font-medium">
            Creating Bella&apos;s Bistro...
          </p>
          <p className="text-sm text-muted-foreground">
            Setting up knowledge base, checklist, and integrations
          </p>
        </div>
      )}
    </div>
  );
}
