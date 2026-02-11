export type AutonomyCategory =
  | "knowledge_management"
  | "code_generation"
  | "deployment"
  | "integrations"
  | "communications"
  | "financial";

export type ApprovalLevel =
  | "full_auto"
  | "notify_after"
  | "quick_confirm"
  | "detailed_approval"
  | "manual_only";

export type ActionRequest = {
  category: AutonomyCategory;
  action: string;
  description: string;
  details?: Record<string, unknown>;
  risk: "low" | "medium" | "high" | "critical";
};

export type ApprovalResult = {
  approved: boolean;
  level: ApprovalLevel;
  reason?: string;
  modifiedParams?: Record<string, unknown>;
};

export const DEFAULT_AUTONOMY: Record<AutonomyCategory, ApprovalLevel> = {
  knowledge_management: "full_auto",
  code_generation: "notify_after",
  deployment: "detailed_approval",
  integrations: "quick_confirm",
  communications: "detailed_approval",
  financial: "manual_only",
};

export const RISK_TO_MIN_LEVEL: Record<string, ApprovalLevel> = {
  low: "full_auto",
  medium: "notify_after",
  high: "quick_confirm",
  critical: "detailed_approval",
};
