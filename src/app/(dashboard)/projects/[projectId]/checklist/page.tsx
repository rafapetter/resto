"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

const STAGES = ["plan", "build", "launch", "grow"] as const;
const STATUSES = [
  "pending",
  "in_progress",
  "blocked",
  "completed",
  "skipped",
] as const;

const stageColors: Record<string, string> = {
  plan: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  build: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  launch: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  grow: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
  skipped: "Skipped",
};

export default function ChecklistPage() {
  const params = useParams<{ projectId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [stageFilter, setStageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStage, setNewStage] = useState<string>("plan");

  const { data: items, isLoading } = useQuery(
    trpc.tasks.list.queryOptions({ projectId: params.projectId })
  );

  const updateStatus = useMutation(
    trpc.tasks.updateStatus.mutationOptions({
      onSuccess: () => {
        toast.success("Status updated");
        queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.queryKey({ projectId: params.projectId }),
        });
      },
      onError: (err) =>
        toast.error("Failed to update status", { description: err.message }),
    })
  );

  const createItem = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: () => {
        toast.success("Item added");
        queryClient.invalidateQueries({
          queryKey: trpc.tasks.list.queryKey({ projectId: params.projectId }),
        });
        setCreateOpen(false);
        setNewTitle("");
        setNewDescription("");
        setNewStage("plan");
      },
      onError: (err) =>
        toast.error("Failed to add item", { description: err.message }),
    })
  );

  // Compute stats
  const total = items?.length ?? 0;
  const completed =
    items?.filter((i) => i.status === "completed").length ?? 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Filter items
  const filtered = (items ?? []).filter((item) => {
    if (stageFilter !== "all" && item.stage !== stageFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  // Count per stage
  const stageCounts = STAGES.reduce(
    (acc, s) => {
      acc[s] = (items ?? []).filter((i) => i.stage === s).length;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Checklist</h1>
          <p className="text-sm text-muted-foreground">
            Track your project milestones and tasks.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          {/* Progress bar */}
          {total > 0 && (
            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {completed} of {total} complete
                </span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Filters */}
          <div className="mb-4 flex items-center gap-3">
            <Tabs
              value={stageFilter}
              onValueChange={setStageFilter}
              className="flex-1"
            >
              <TabsList>
                <TabsTrigger value="all">All ({total})</TabsTrigger>
                {STAGES.map((s) => (
                  <TabsTrigger key={s} value={s}>
                    <span className="capitalize">{s}</span>
                    <Badge variant="secondary" className="ml-1.5 px-1.5 text-xs">
                      {stageCounts[s]}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusLabels[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Items */}
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge className={stageColors[item.stage] ?? ""}>
                          {item.stage}
                        </Badge>
                        <Select
                          value={item.status}
                          onValueChange={(status) =>
                            updateStatus.mutate({
                              id: item.id,
                              status: status as (typeof STATUSES)[number],
                            })
                          }
                        >
                          <SelectTrigger className="h-7 w-[130px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {statusLabels[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
            <p className="py-8 text-center text-muted-foreground">
              {total === 0
                ? "No checklist items yet. Add one to get started!"
                : "No items match the current filters."}
            </p>
          )}
        </>
      )}

      {/* Add Item Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Checklist Item</DialogTitle>
            <DialogDescription>
              Create a new task for your project checklist.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What needs to be done?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Add more details..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select value={newStage} onValueChange={setNewStage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="capitalize">{s}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newTitle.trim() || createItem.isPending}
              onClick={() =>
                createItem.mutate({
                  projectId: params.projectId,
                  title: newTitle.trim(),
                  description: newDescription.trim() || undefined,
                  stage: newStage as (typeof STAGES)[number],
                })
              }
            >
              {createItem.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
