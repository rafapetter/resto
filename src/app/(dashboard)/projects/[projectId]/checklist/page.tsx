"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stageColors: Record<string, string> = {
  plan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  build: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  launch: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  grow: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export default function ChecklistPage() {
  const params = useParams<{ projectId: string }>();
  const trpc = useTRPC();
  const { data: items, isLoading } = useQuery(
    trpc.tasks.list.queryOptions({ projectId: params.projectId })
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Checklist</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={stageColors[item.stage] ?? ""}>
                      {item.stage}
                    </Badge>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              {item.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No checklist items yet.</p>
      )}
    </div>
  );
}
