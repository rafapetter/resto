import type { AutonomyCategory } from "@/lib/autonomy/types";

export type TaskType =
  | "code_generation"
  | "deployment"
  | "content_creation"
  | "research"
  | "integration_setup"
  | "knowledge_update"
  | "checklist_management"
  | "business_analysis";

export type SpawnParams = {
  taskType: TaskType;
  description: string;
  projectId: string;
  tenantId: string;
  context: Record<string, unknown>;
  knowledgeQuery?: string;
  parentTaskId?: string;
};

export type TaskStatus = "pending" | "running" | "completed" | "failed";

export type TaskInstance = {
  id: string;
  taskType: TaskType;
  description: string;
  status: TaskStatus;
  projectId: string;
  tenantId: string;
  context: Record<string, unknown>;
  knowledgeContext: string;
  result?: unknown;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
};

export const TASK_TYPE_TO_CATEGORIES: Record<TaskType, AutonomyCategory> = {
  code_generation: "code_generation",
  deployment: "deployment",
  content_creation: "knowledge_management",
  research: "knowledge_management",
  integration_setup: "integrations",
  knowledge_update: "knowledge_management",
  checklist_management: "knowledge_management",
  business_analysis: "knowledge_management",
};
