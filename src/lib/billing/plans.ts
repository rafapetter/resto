export type PlanId = "free" | "pro" | "scale";

export type PlanLimits = {
  projects: number;       // -1 = unlimited
  tokensPerMonth: number; // -1 = unlimited
  kbStorageMb: number;    // -1 = unlimited
  agentActions: boolean;
};

export type Plan = {
  id: PlanId;
  name: string;
  priceMonthly: number;
  limits: PlanLimits;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    limits: { projects: 1, tokensPerMonth: 50_000, kbStorageMb: 5, agentActions: false },
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 29,
    limits: { projects: 10, tokensPerMonth: 1_000_000, kbStorageMb: 100, agentActions: true },
  },
  scale: {
    id: "scale",
    name: "Scale",
    priceMonthly: 99,
    limits: { projects: -1, tokensPerMonth: -1, kbStorageMb: -1, agentActions: true },
  },
};

export function getPlan(planId: string): Plan {
  return PLANS[planId as PlanId] ?? PLANS.free;
}

export function isUnlimited(limit: number): boolean {
  return limit === -1;
}

export function formatLimit(limit: number, unit = ""): string {
  if (isUnlimited(limit)) return "Unlimited";
  if (unit === "tokens" && limit >= 1_000_000) return `${limit / 1_000_000}M`;
  if (unit === "tokens" && limit >= 1_000) return `${limit / 1_000}K`;
  return `${limit}${unit ? " " + unit : ""}`;
}
