import { pgEnum } from "drizzle-orm/pg-core";

export const projectStatus = pgEnum("project_status", [
  "draft",
  "onboarding",
  "active",
  "paused",
  "archived",
]);

export const onboardingStep = pgEnum("onboarding_step", [
  "welcome",
  "business_info",
  "template_selection",
  "integrations",
  "review",
  "complete",
]);

export const checklistStage = pgEnum("checklist_stage", [
  "plan",
  "build",
  "launch",
  "grow",
]);

export const checklistStatus = pgEnum("checklist_status", [
  "pending",
  "in_progress",
  "blocked",
  "completed",
  "skipped",
]);

export const knowledgeTier = pgEnum("knowledge_tier", [
  "index",
  "summary",
  "detail",
]);

export const authType = pgEnum("auth_type", [
  "oauth2",
  "api_key",
  "webhook",
]);

export const credentialStatus = pgEnum("credential_status", [
  "active",
  "expired",
  "revoked",
  "error",
]);

export const autonomyCategory = pgEnum("autonomy_category", [
  "knowledge_management",
  "code_generation",
  "deployment",
  "integrations",
  "communications",
  "financial",
]);

export const autonomyLevel = pgEnum("autonomy_level", [
  "full_auto",
  "notify_after",
  "quick_confirm",
  "detailed_approval",
  "manual_only",
]);
