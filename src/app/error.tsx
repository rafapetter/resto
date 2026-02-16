"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <a href="/projects">Go to Projects</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
