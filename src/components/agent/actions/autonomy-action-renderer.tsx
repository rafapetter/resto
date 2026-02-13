"use client";

import { useEffect, useRef, useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { AutonomyGate } from "./autonomy-gate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import type {
  AutonomyCategory,
  ApprovalLevel,
  ApprovalResult,
  ActionRequest,
} from "@/lib/autonomy/types";

type AutonomyActionRendererProps = {
  status: "inProgress" | "executing" | "complete";
  args: Record<string, unknown>;
  respond?: (result: string) => void;
  result?: string;
  category: AutonomyCategory;
  actionName: string;
  risk: "low" | "medium" | "high" | "critical";
  projectId: string;
  execute: () => Promise<unknown>;
  description: string;
};

type Phase =
  | "checking"
  | "auto_executing"
  | "awaiting_approval"
  | "executing_approved"
  | "done"
  | "denied"
  | "manual_only";

export function AutonomyActionRenderer({
  status,
  args,
  respond,
  result,
  category,
  actionName,
  risk,
  projectId,
  execute,
  description,
}: AutonomyActionRendererProps) {
  const trpc = useTRPC();
  const executedRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("checking");
  const [approval, setApproval] = useState<ApprovalResult | null>(null);
  const [actionResult, setActionResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const checkAutonomy = useMutation(
    trpc.autonomy.check.mutationOptions({})
  );
  const logAction = useMutation(
    trpc.autonomy.logAction.mutationOptions({})
  );

  const actionRequest: ActionRequest = {
    category,
    action: actionName,
    description,
    risk,
    details: args,
  };

  // Run the autonomy check when status transitions to "executing"
  useEffect(() => {
    if (status !== "executing" || executedRef.current) return;
    executedRef.current = true;

    async function run() {
      try {
        const result = await checkAutonomy.mutateAsync({
          projectId,
          category,
          action: actionName,
          description,
          risk,
        });

        setApproval(result);

        if (result.approved) {
          // full_auto or notify_after — execute immediately
          setPhase("auto_executing");
          try {
            const execResult = await execute();
            const resultStr = JSON.stringify(execResult);
            setActionResult(resultStr);
            setPhase("done");

            // Log audit
            logAction.mutate({
              projectId,
              action: actionName,
              details: {
                ...args,
                outcome:
                  result.level === "notify_after"
                    ? "auto_executed_notify"
                    : "auto_executed",
                category,
                risk,
              },
            });

            respond?.(resultStr);
          } catch (err) {
            const errMsg =
              err instanceof Error ? err.message : "Action failed";
            setError(errMsg);
            setPhase("done");
            respond?.(JSON.stringify({ error: errMsg }));
          }
        } else if (result.level === "manual_only") {
          setPhase("manual_only");
          logAction.mutate({
            projectId,
            action: actionName,
            details: {
              ...args,
              outcome: "manual_only_guidance",
              category,
              risk,
            },
          });
          respond?.(
            JSON.stringify({
              status: "manual_only",
              message: `This action requires manual execution. The user's autonomy preferences are set to "manual only" for ${category.replace(/_/g, " ")}. Guide the user to perform this action themselves in the dashboard.`,
            })
          );
        } else {
          // quick_confirm or detailed_approval — wait for user
          setPhase("awaiting_approval");
        }
      } catch (err) {
        const errMsg =
          err instanceof Error ? err.message : "Autonomy check failed";
        setError(errMsg);
        setPhase("done");
        respond?.(JSON.stringify({ error: errMsg }));
      }
    }

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleApprove = async () => {
    setPhase("executing_approved");
    try {
      const execResult = await execute();
      const resultStr = JSON.stringify(execResult);
      setActionResult(resultStr);
      setPhase("done");

      logAction.mutate({
        projectId,
        action: actionName,
        details: {
          ...args,
          outcome: "executed_after_approval",
          approvalLevel: approval?.level,
          category,
          risk,
        },
      });

      respond?.(resultStr);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Action failed";
      setError(errMsg);
      setPhase("done");
      respond?.(JSON.stringify({ error: errMsg }));
    }
  };

  const handleDeny = (reason?: string) => {
    setPhase("denied");

    logAction.mutate({
      projectId,
      action: actionName,
      details: {
        ...args,
        outcome: "denied_by_user",
        denyReason: reason,
        category,
        risk,
      },
    });

    respond?.(
      JSON.stringify({
        status: "denied",
        message: reason
          ? `Action denied by user: ${reason}`
          : "Action denied by user",
      })
    );
  };

  // ─── Render based on phase ───────────────────────────────────────

  if (status === "inProgress") {
    return (
      <Card className="my-2">
        <CardContent className="flex items-center gap-2 py-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Preparing action...
          </span>
        </CardContent>
      </Card>
    );
  }

  // Phase-based checks first (these set internal state before CopilotKit
  // transitions status to "complete" via respond())
  if (phase === "denied") {
    return (
      <Card className="my-2 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        <CardContent className="py-3">
          <p className="text-sm text-muted-foreground">Action denied</p>
        </CardContent>
      </Card>
    );
  }

  if (phase === "awaiting_approval" && approval) {
    return (
      <AutonomyGate
        request={actionRequest}
        approval={approval}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    );
  }

  if (phase === "manual_only" && approval) {
    return (
      <AutonomyGate
        request={actionRequest}
        approval={approval}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    );
  }

  if (phase === "checking" || phase === "auto_executing" || phase === "executing_approved") {
    return (
      <Card className="my-2">
        <CardContent className="flex items-center gap-2 py-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {phase === "checking"
              ? "Checking permissions..."
              : "Executing action..."}
          </span>
        </CardContent>
      </Card>
    );
  }

  // Terminal states (status === "complete" or phase === "done")
  if (error) {
    return (
      <Card className="my-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardContent className="py-3">
          <p className="text-sm text-red-700 dark:text-red-300">
            Failed: {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (approval?.level === "notify_after") {
    return (
      <Card className="my-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
            <Info className="h-4 w-4" />
            Action Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {description}
          </p>
          <p className="mt-1 text-xs text-blue-500/70 dark:text-blue-400/50">
            Auto-approved based on your autonomy preferences
          </p>
        </CardContent>
      </Card>
    );
  }

  if (phase === "done") {
    return (
      <Card className="my-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CardContent className="flex items-center gap-2 py-3">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Done
          </span>
        </CardContent>
      </Card>
    );
  }

  return null;
}
