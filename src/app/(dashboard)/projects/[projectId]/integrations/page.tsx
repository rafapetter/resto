"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ProviderCard } from "@/components/integrations/provider-card";
import { CheckCircle, XCircle } from "lucide-react";

export default function IntegrationsPage() {
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const trpc = useTRPC();

  const { data: providers, isLoading } = useQuery(
    trpc.credentials.providers.queryOptions({ projectId: params.projectId })
  );

  // ─── Banner from OAuth redirect ──────────────────────────────────

  const connected = searchParams.get("connected");
  const error = searchParams.get("error");
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (connected) {
      setBanner({
        type: "success",
        message: `Successfully connected ${connected}!`,
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (error) {
      const messages: Record<string, string> = {
        oauth_denied: "Authorization was denied by the provider.",
        oauth_invalid: "Invalid OAuth request. Please try again.",
        oauth_expired: "OAuth session expired. Please try again.",
        oauth_exchange_failed:
          "Failed to complete the connection. Please try again.",
        unknown_provider: "Unknown integration provider.",
      };
      setBanner({
        type: "error",
        message: messages[error] ?? `Connection failed: ${error}`,
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [connected, error]);

  // ─── Render ──────────────────────────────────────────────────────

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Connect external services to power your project.
        </p>
      </div>

      {banner && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-md border px-4 py-3 text-sm ${
            banner.type === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {banner.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1">{banner.message}</span>
          <button
            onClick={() => setBanner(null)}
            className="shrink-0 underline underline-offset-2 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-lg border bg-muted"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {providers?.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              projectId={params.projectId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
