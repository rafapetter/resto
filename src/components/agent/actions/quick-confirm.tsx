"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type QuickConfirmProps = {
  action: string;
  description: string;
  onApprove: () => void;
  onDeny: (reason?: string) => void;
  disabled?: boolean;
};

export function QuickConfirm({
  action,
  description,
  onApprove,
  onDeny,
  disabled,
}: QuickConfirmProps) {
  return (
    <Card className="my-2 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Confirm Action: {action}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" onClick={onApprove} disabled={disabled}>
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDeny()}
          disabled={disabled}
        >
          Deny
        </Button>
      </CardFooter>
    </Card>
  );
}
