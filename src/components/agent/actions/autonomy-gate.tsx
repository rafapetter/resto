"use client";

import { useState } from "react";
import type { ApprovalResult, ActionRequest } from "@/lib/autonomy/types";
import { QuickConfirm } from "./quick-confirm";
import { DetailedApproval } from "./detailed-approval";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HandMetal } from "lucide-react";

type AutonomyGateProps = {
  request: ActionRequest;
  approval: ApprovalResult;
  onApprove: () => void;
  onDeny: (reason?: string) => void;
};

export function AutonomyGate({
  request,
  approval,
  onApprove,
  onDeny,
}: AutonomyGateProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = () => {
    setIsProcessing(true);
    onApprove();
  };

  const handleDeny = (reason?: string) => {
    setIsProcessing(true);
    onDeny(reason);
  };

  if (approval.level === "quick_confirm") {
    return (
      <QuickConfirm
        action={request.action}
        description={request.description}
        onApprove={handleApprove}
        onDeny={handleDeny}
        disabled={isProcessing}
      />
    );
  }

  if (approval.level === "detailed_approval") {
    return (
      <DetailedApproval
        request={request}
        onApprove={handleApprove}
        onDeny={handleDeny}
        disabled={isProcessing}
      />
    );
  }

  if (approval.level === "manual_only") {
    return (
      <Card className="my-2 border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <HandMetal className="h-4 w-4" />
            Manual Action Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {request.description}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            This action is set to &quot;manual only&quot; &mdash; Resto can only
            advise. Please perform this action yourself in the dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
