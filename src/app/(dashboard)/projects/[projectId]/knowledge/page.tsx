"use client";

import { useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Search, Trash2, Info, Loader2 } from "lucide-react";

const tierColors: Record<string, string> = {
  index: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  summary:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  detail:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

function DocumentContent({ fileId }: { fileId: string }) {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.knowledgeBase.getById.queryOptions({ id: fileId })
  );

  if (isLoading) {
    return (
      <div className="space-y-2 py-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="py-2 text-sm text-muted-foreground">
        Document not found.
      </p>
    );
  }

  const chunks = (data.embeddings ?? [])
    .sort((a, b) => a.chunkIndex - b.chunkIndex)
    .map((e) => e.content)
    .join("\n\n");

  return (
    <div className="py-2">
      <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
        {chunks || "No content available."}
      </pre>
    </div>
  );
}

export default function KnowledgeBasePage() {
  const params = useParams<{ projectId: string }>();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [showLegend, setShowLegend] = useState(false);

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newTier, setNewTier] = useState<string>("summary");
  const [newContent, setNewContent] = useState("");

  // Debounce search
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300);
  }, []);

  const { data: files, isLoading } = useQuery(
    trpc.knowledgeBase.list.queryOptions({ projectId: params.projectId })
  );

  const createDoc = useMutation(
    trpc.knowledgeBase.create.mutationOptions({
      onSuccess: () => {
        toast.success("Document created");
        queryClient.invalidateQueries({
          queryKey: trpc.knowledgeBase.list.queryKey({
            projectId: params.projectId,
          }),
        });
        setCreateOpen(false);
        setNewTitle("");
        setNewTier("summary");
        setNewContent("");
      },
      onError: (err) =>
        toast.error("Failed to create document", { description: err.message }),
    })
  );

  const deleteDoc = useMutation(
    trpc.knowledgeBase.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Document deleted");
        queryClient.invalidateQueries({
          queryKey: trpc.knowledgeBase.list.queryKey({
            projectId: params.projectId,
          }),
        });
        setDeleteId(null);
      },
      onError: (err) =>
        toast.error("Failed to delete document", { description: err.message }),
    })
  );

  // Filter by title
  const filtered = (files ?? []).filter(
    (f) =>
      !debouncedSearch ||
      f.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">
            Project documents and reference materials.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowLegend(!showLegend)}
          >
            <Info className="h-4 w-4" />
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Tier legend */}
      {showLegend && (
        <div className="mb-4 rounded-lg border bg-muted/50 p-4 text-sm">
          <p className="mb-2 font-medium">Document Tiers</p>
          <div className="space-y-1 text-muted-foreground">
            <p>
              <Badge className={tierColors.index}>index</Badge> Quick reference
              — up to 50 lines / 2,000 chars
            </p>
            <p>
              <Badge className={tierColors.summary}>summary</Badge> Overview
              documents — up to 50 lines / 2,000 chars
            </p>
            <p>
              <Badge className={tierColors.detail}>detail</Badge> Full
              documentation — up to 1,000 lines / 50,000 chars
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-2">
          {filtered.map((file) => (
            <AccordionItem
              key={file.id}
              value={file.id}
              className="rounded-lg border px-4"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <span className="text-sm font-medium">{file.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {file.lineCount} lines / {file.charCount} chars
                    </span>
                    <Badge className={tierColors[file.tier] ?? ""}>
                      {file.tier}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <DocumentContent fileId={file.id} />
                <div className="flex justify-end pt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeleteId(file.id);
                      setDeleteTitle(file.title);
                    }}
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="py-8 text-center text-muted-foreground">
          {(files ?? []).length === 0
            ? "No knowledge base files yet. Resto will populate this as you work, or add one manually."
            : "No documents match your search."}
        </p>
      )}

      {/* Create Document Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>
              Create a new knowledge base document for this project.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-title">Title</Label>
              <Input
                id="doc-title"
                placeholder="Document title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tier</Label>
              <Select value={newTier} onValueChange={setNewTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index">Index (quick reference)</SelectItem>
                  <SelectItem value="summary">Summary (overview)</SelectItem>
                  <SelectItem value="detail">
                    Detail (full documentation)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-content">Content</Label>
              <Textarea
                id="doc-content"
                placeholder="Document content (markdown supported)..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                !newTitle.trim() || !newContent.trim() || createDoc.isPending
              }
              onClick={() =>
                createDoc.mutate({
                  projectId: params.projectId,
                  title: newTitle.trim(),
                  content: newContent.trim(),
                  tier: newTier as "index" | "summary" | "detail",
                })
              }
            >
              {createDoc.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleteTitle}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this document and all its embeddings.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteDoc.mutate({ id: deleteId })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
