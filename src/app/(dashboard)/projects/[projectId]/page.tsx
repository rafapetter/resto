"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, CheckSquare, BookOpen, Plug } from "lucide-react";

const sections = [
  {
    title: "Chat",
    description: "Talk with Resto about your project",
    href: "chat",
    icon: MessageSquare,
  },
  {
    title: "Checklist",
    description: "Track your project milestones",
    href: "checklist",
    icon: CheckSquare,
  },
  {
    title: "Knowledge Base",
    description: "Project documentation and context",
    href: "knowledge",
    icon: BookOpen,
  },
  {
    title: "Integrations",
    description: "Connected services and APIs",
    href: "integrations",
    icon: Plug,
  },
];

export default function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  const trpc = useTRPC();
  const { data: project, isLoading } = useQuery(
    trpc.projects.getById.queryOptions({ id: params.projectId })
  );

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-1 h-4 w-48" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <Badge variant="secondary">{project.status}</Badge>
        </div>
        {project.description && (
          <p className="mt-1 text-muted-foreground">{project.description}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={`/projects/${params.projectId}/${section.href}`}
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
