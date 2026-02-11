"use client";

import { useState } from "react";
import type { ApprovalResult, ActionRequest } from "@/lib/autonomy/types";
import { QuickConfirm } from "./quick-confirm";
import { DetailedApproval } from "./detailed-approval";

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

  if (
    approval.level === "detailed_approval" ||
    approval.level === "manual_only"
  ) {
    return (
      <DetailedApproval
        request={request}
        onApprove={handleApprove}
        onDeny={handleDeny}
        disabled={isProcessing}
      />
    );
  }

  return null;
}
