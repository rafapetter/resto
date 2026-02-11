import { db } from "@/server/db";
import { autonomySettings, auditLog } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import {
  DEFAULT_AUTONOMY,
  RISK_TO_MIN_LEVEL,
  type ActionRequest,
  type ApprovalLevel,
  type ApprovalResult,
  type AutonomyCategory,
} from "./types";

const LEVEL_ORDER: ApprovalLevel[] = [
  "full_auto",
  "notify_after",
  "quick_confirm",
  "detailed_approval",
  "manual_only",
];

function levelIndex(level: ApprovalLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

export class AutonomyChecker {
  private tenantId: string;
  private projectId?: string;

  constructor(tenantId: string, projectId?: string) {
    this.tenantId = tenantId;
    this.projectId = projectId;
  }

  async getLevel(category: AutonomyCategory): Promise<ApprovalLevel> {
    // Check project-specific settings first
    if (this.projectId) {
      const projectSetting = await db.query.autonomySettings.findFirst({
        where: and(
          eq(autonomySettings.tenantId, this.tenantId),
          eq(autonomySettings.projectId, this.projectId),
          eq(autonomySettings.category, category)
        ),
      });
      if (projectSetting) return projectSetting.level as ApprovalLevel;
    }

    // Fall back to tenant-level settings
    const tenantSetting = await db.query.autonomySettings.findFirst({
      where: and(
        eq(autonomySettings.tenantId, this.tenantId),
        eq(autonomySettings.category, category)
      ),
    });
    if (tenantSetting) return tenantSetting.level as ApprovalLevel;

    // Fall back to defaults
    return DEFAULT_AUTONOMY[category];
  }

  async check(request: ActionRequest): Promise<ApprovalResult> {
    const configuredLevel = await this.getLevel(request.category);
    const minRiskLevel = RISK_TO_MIN_LEVEL[request.risk] ?? "full_auto";

    // Use the stricter of the two levels
    const effectiveLevel =
      levelIndex(configuredLevel) >= levelIndex(minRiskLevel)
        ? configuredLevel
        : minRiskLevel;

    // Determine if approval is needed
    const needsApproval =
      effectiveLevel === "quick_confirm" ||
      effectiveLevel === "detailed_approval" ||
      effectiveLevel === "manual_only";

    if (!needsApproval) {
      // Auto-approve, but log if notify_after
      if (effectiveLevel === "notify_after") {
        await this.logAction(request, "auto_approved_notify");
      }
      return { approved: true, level: effectiveLevel };
    }

    // Needs human approval
    return {
      approved: false,
      level: effectiveLevel,
      reason: `Action "${request.action}" requires ${effectiveLevel} for category "${request.category}"`,
    };
  }

  async logAction(
    request: ActionRequest,
    outcome: string,
    details?: Record<string, unknown>
  ) {
    await db.insert(auditLog).values({
      tenantId: this.tenantId,
      projectId: this.projectId,
      action: request.action,
      performedBy: "resto_agent",
      details: {
        category: request.category,
        description: request.description,
        risk: request.risk,
        outcome,
        ...details,
      },
    });
  }
}
