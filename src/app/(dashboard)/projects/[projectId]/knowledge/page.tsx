"use client";

import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function KnowledgeBasePage() {
  const params = useParams<{ projectId: string }>();
  const trpc = useTRPC();
  const { data: files, isLoading } = useQuery(
    trpc.knowledgeBase.list.queryOptions({ projectId: params.projectId })
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Knowledge Base</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : files && files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file) => (
            <Card key={file.id}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{file.title}</CardTitle>
                  <Badge variant="secondary">{file.tier}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {file.lineCount} lines / {file.charCount} chars
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No knowledge base files yet. Resto will populate this as you work.
        </p>
      )}
    </div>
  );
}
