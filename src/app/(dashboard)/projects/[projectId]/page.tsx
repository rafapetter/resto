"use client";

import { useParams } from "next/navigation";
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
  const { data: project } = useQuery(
    trpc.projects.getById.queryOptions({ id: params.projectId })
  );

  if (!project) {
    return <div className="text-muted-foreground">Loading project...</div>;
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
