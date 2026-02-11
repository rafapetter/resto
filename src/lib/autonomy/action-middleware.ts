import { AutonomyChecker } from "./checker";
import type { ActionRequest, ApprovalResult } from "./types";

export type MiddlewareContext = {
  tenantId: string;
  projectId?: string;
};

export type ActionExecutor<T = unknown> = () => Promise<T>;

export type ActionWithApproval<T = unknown> = {
  result?: T;
  approval: ApprovalResult;
  pendingAction?: ActionExecutor<T>;
};

export async function withAutonomyCheck<T>(
  context: MiddlewareContext,
  request: ActionRequest,
  execute: ActionExecutor<T>
): Promise<ActionWithApproval<T>> {
  const checker = new AutonomyChecker(context.tenantId, context.projectId);
  const approval = await checker.check(request);

  if (approval.approved) {
    // Execute immediately
    const result = await execute();
    await checker.logAction(request, "executed", {
      autoApproved: true,
    });
    return { result, approval };
  }

  // Return pending action for HITL approval
  return {
    approval,
    pendingAction: async () => {
      const result = await execute();
      await checker.logAction(request, "executed_after_approval");
      return result;
    },
  };
}
