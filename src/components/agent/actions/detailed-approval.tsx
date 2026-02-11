"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ActionRequest } from "@/lib/autonomy/types";

type DetailedApprovalProps = {
  request: ActionRequest;
  onApprove: () => void;
  onDeny: (reason?: string) => void;
  disabled?: boolean;
};

const riskColors: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

export function DetailedApproval({
  request,
  onApprove,
  onDeny,
  disabled,
}: DetailedApprovalProps) {
  const [denyReason, setDenyReason] = useState("");

  return (
    <Card className="my-2 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Approval Required: {request.action}
          </CardTitle>
          <Badge className={riskColors[request.risk] ?? ""}>
            {request.risk} risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-2">
        <div>
          <p className="text-sm font-medium">Description</p>
          <p className="text-sm text-muted-foreground">
            {request.description}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Category</p>
          <p className="text-sm text-muted-foreground">{request.category}</p>
        </div>
        {request.details && Object.keys(request.details).length > 0 && (
          <div>
            <p className="text-sm font-medium">Details</p>
            <pre className="mt-1 rounded bg-muted p-2 text-xs">
              {JSON.stringify(request.details, null, 2)}
            </pre>
          </div>
        )}
        <div>
          <p className="mb-1 text-sm font-medium">Reason for denial (optional)</p>
          <Input
            value={denyReason}
            onChange={(e) => setDenyReason(e.target.value)}
            placeholder="Why are you denying this action?"
            className="text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" onClick={onApprove} disabled={disabled}>
          Approve
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDeny(denyReason || undefined)}
          disabled={disabled}
        >
          Deny
        </Button>
      </CardFooter>
    </Card>
  );
}
