"use client";

import { useUser } from "@clerk/nextjs";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AutonomyPreferences } from "@/components/onboarding/steps/autonomy-preferences";
import { DEFAULT_AUTONOMY } from "@/lib/autonomy/types";
import type { AutonomyCategory, ApprovalLevel } from "@/lib/autonomy/types";
import { toast } from "sonner";
import { Settings, User } from "lucide-react";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: autonomyRows, isLoading: autonomyLoading } = useQuery(
    trpc.settings.getAutonomy.queryOptions({})
  );

  const updateAutonomy = useMutation(
    trpc.settings.updateAutonomy.mutationOptions({
      onSuccess: () => {
        toast.success("Preference saved");
        queryClient.invalidateQueries({
          queryKey: trpc.settings.getAutonomy.queryKey({}),
        });
      },
      onError: (err) =>
        toast.error("Failed to save preference", { description: err.message }),
    })
  );

  // Convert DB rows to Record<AutonomyCategory, ApprovalLevel>
  const preferences: Record<AutonomyCategory, ApprovalLevel> = {
    ...DEFAULT_AUTONOMY,
  };
  if (autonomyRows) {
    for (const row of autonomyRows) {
      preferences[row.category as AutonomyCategory] =
        row.level as ApprovalLevel;
    }
  }

  const handleAutonomyChange = (
    category: AutonomyCategory,
    level: ApprovalLevel
  ) => {
    updateAutonomy.mutate({ category, level });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and global preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoaded ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName ?? "Avatar"}
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-medium">
                      {(user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "U")[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {user.fullName ?? "No name set"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <a href="/user-profile">Manage Account</a>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">Not signed in.</p>
            )}
          </CardContent>
        </Card>

        {/* Autonomy Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Autonomy Preferences
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Control how much autonomy Resto has globally. Project-level
              overrides can be set in each project's settings.
            </p>
          </CardHeader>
          <CardContent>
            {autonomyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <AutonomyPreferences
                preferences={preferences}
                onChange={handleAutonomyChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
