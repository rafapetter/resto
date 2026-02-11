"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsPage() {
  const params = useParams<{ projectId: string }>();
  const trpc = useTRPC();
  const { data: credentials, isLoading } = useQuery(
    trpc.credentials.list.queryOptions({ projectId: params.projectId })
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Integrations</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : credentials && credentials.length > 0 ? (
        <div className="space-y-3">
          {credentials.map((cred) => (
            <Card key={cred.id}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{cred.provider}</CardTitle>
                  <Badge
                    variant={
                      cred.status === "active" ? "default" : "destructive"
                    }
                  >
                    {cred.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Type: {cred.authType}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No integrations connected yet.
        </p>
      )}
    </div>
  );
}
