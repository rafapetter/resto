"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import {
  useCopilotReadable,
  useCopilotAction,
} from "@copilotkit/react-core";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildSystemPrompt } from "@/lib/agent/prompts/system";
import "@copilotkit/react-ui/styles.css";

type Props = {
  projectId: string;
};

export function RestoChat({ projectId }: Props) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        <RestoChatInner projectId={projectId} />
      </div>
    </CopilotKit>
  );
}

function RestoChatInner({ projectId }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // ─── Load full project context ────────────────────────────────────

  const { data: context } = useQuery(
    trpc.projects.getFullContext.queryOptions({ projectId })
  );

  const { data: conversation } = useQuery(
    trpc.chat.getConversation.queryOptions({ projectId })
  );

  const isFirstVisit = context?.project && !conversation;

  // ─── Build system prompt ──────────────────────────────────────────

  const systemPrompt = context?.project
    ? buildSystemPrompt({
        projectName: context.project.name,
        projectDescription: context.project.description ?? undefined,
        checklistStage: context.currentStage ?? undefined,
        knowledgeSummary: context.knowledgeContext || undefined,
        autonomyPreferences: context.autonomy.map((a) => ({
          category: a.category,
          level: a.level,
        })),
        integrationsSummary: context.integrations?.length
          ? context.integrations
              .map(
                (i) =>
                  `${i.provider}: ${i.status}${i.accountLabel ? ` (${i.accountLabel})` : ""}`
              )
              .join(", ")
          : "No integrations connected yet",
        isFirstVisit: !!isFirstVisit,
      })
    : undefined;

  // ─── Readable state ───────────────────────────────────────────────

  useCopilotReadable({
    description:
      "Current project information including name, description, and status",
    value: context?.project ?? null,
  });

  useCopilotReadable({
    description:
      "Project checklist items organized by stage (plan, build, launch, grow) with their statuses",
    value: context?.checklist ?? [],
  });

  useCopilotReadable({
    description:
      "Project autonomy preferences that control what Resto can do automatically vs. needs approval",
    value: context?.autonomy ?? [],
  });

  useCopilotReadable({
    description:
      "Connected integrations and their statuses (GitHub, Vercel, Stripe, Webhook)",
    value: context?.integrations ?? [],
  });

  // ─── Mutations for actions ────────────────────────────────────────

  const searchKB = useMutation(
    trpc.knowledgeBase.search.mutationOptions({})
  );
  const createKB = useMutation(
    trpc.knowledgeBase.create.mutationOptions({})
  );
  const createTask = useMutation(trpc.tasks.create.mutationOptions({}));
  const updateTaskStatus = useMutation(
    trpc.tasks.updateStatus.mutationOptions({})
  );
  const initiateOAuth = useMutation(
    trpc.credentials.initiateOAuth.mutationOptions({})
  );

  // ─── Actions ──────────────────────────────────────────────────────

  useCopilotAction({
    name: "searchKnowledgeBase",
    description:
      "Search the project knowledge base for relevant information about the business, plans, or technical decisions.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "Natural language search query",
        required: true,
      },
    ],
    handler: async ({ query }: { query: string }) => {
      const results = await searchKB.mutateAsync({
        projectId,
        query,
      });
      return results;
    },
  });

  useCopilotAction({
    name: "createKnowledgeEntry",
    description:
      "Create a new knowledge base document to store project information, decisions, or research.",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Document title",
        required: true,
      },
      {
        name: "content",
        type: "string",
        description: "Document content in markdown format",
        required: true,
      },
      {
        name: "tier",
        type: "string",
        description:
          "Document tier: 'index' for quick reference, 'summary' for overviews, 'detail' for full docs",
        required: true,
      },
    ],
    handler: async ({
      title,
      content,
      tier,
    }: {
      title: string;
      content: string;
      tier: string;
    }) => {
      const result = await createKB.mutateAsync({
        projectId,
        title,
        content,
        tier: tier as "index" | "summary" | "detail",
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.knowledgeBase.list.queryKey({ projectId }),
      });
      return result;
    },
  });

  useCopilotAction({
    name: "createChecklistItem",
    description:
      "Add a new item to the project checklist to track tasks and milestones.",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Task title",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Task description with details",
        required: false,
      },
      {
        name: "stage",
        type: "string",
        description:
          "Project stage: 'plan', 'build', 'launch', or 'grow'",
        required: true,
      },
    ],
    handler: async ({
      title,
      description,
      stage,
    }: {
      title: string;
      description?: string;
      stage: string;
    }) => {
      const result = await createTask.mutateAsync({
        projectId,
        title,
        description,
        stage: stage as "plan" | "build" | "launch" | "grow",
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.tasks.list.queryKey({ projectId }),
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.projects.getFullContext.queryKey({ projectId }),
      });
      return result;
    },
  });

  useCopilotAction({
    name: "updateChecklistItem",
    description:
      "Update the status of a checklist item to track progress.",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The checklist item ID",
        required: true,
      },
      {
        name: "status",
        type: "string",
        description:
          "New status: 'pending', 'in_progress', 'blocked', 'completed', or 'skipped'",
        required: true,
      },
    ],
    handler: async ({ id, status }: { id: string; status: string }) => {
      const result = await updateTaskStatus.mutateAsync({
        id,
        status: status as
          | "pending"
          | "in_progress"
          | "blocked"
          | "completed"
          | "skipped",
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.tasks.list.queryKey({ projectId }),
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.projects.getFullContext.queryKey({ projectId }),
      });
      return result;
    },
  });

  useCopilotAction({
    name: "getProjectChecklist",
    description:
      "Retrieve all current checklist items and their statuses to review project progress.",
    parameters: [],
    handler: async () => {
      const items = await queryClient.fetchQuery(
        trpc.tasks.list.queryOptions({ projectId })
      );
      return items;
    },
  });

  useCopilotAction({
    name: "checkIntegrations",
    description:
      "Check which integrations are connected for this project and their statuses.",
    parameters: [],
    handler: async () => {
      const providers = await queryClient.fetchQuery(
        trpc.credentials.providers.queryOptions({ projectId })
      );
      return providers.map((p) => ({
        provider: p.name,
        id: p.id,
        connected: p.connected,
        status: p.status,
        accountLabel: p.accountLabel,
        available: p.available,
      }));
    },
  });

  useCopilotAction({
    name: "getIntegrationSetupUrl",
    description:
      "Get the setup URL or instructions for connecting a specific integration provider (github, vercel, stripe, webhook).",
    parameters: [
      {
        name: "provider",
        type: "string",
        description: "The provider ID: github, vercel, stripe, or webhook",
        required: true,
      },
    ],
    handler: async ({ provider }: { provider: string }) => {
      const providers = await queryClient.fetchQuery(
        trpc.credentials.providers.queryOptions({ projectId })
      );
      const p = providers.find((pr) => pr.id === provider);
      if (!p) return { error: "Unknown provider" };

      if (p.connected) {
        return {
          status: "already_connected",
          accountLabel: p.accountLabel,
        };
      }

      if (p.authType === "oauth2") {
        if (!p.available) {
          return {
            error: `${p.name} OAuth is not configured yet. The admin needs to set the environment variables.`,
          };
        }
        const result = await initiateOAuth.mutateAsync({
          projectId,
          provider,
        });
        return {
          authType: "oauth2",
          setupUrl: result.authorizeUrl,
          instructions: `To connect ${p.name}, open this URL: ${result.authorizeUrl}`,
        };
      }

      if (p.authType === "api_key") {
        return {
          authType: "api_key",
          instructions: `Go to the Integrations page to enter your ${p.name} API key. Navigate to the integrations tab in your project settings.`,
        };
      }

      return {
        authType: "webhook",
        instructions: `Go to the Integrations page to configure your webhook URL. Navigate to the integrations tab in your project settings.`,
      };
    },
  });

  // ─── Greeting ─────────────────────────────────────────────────────

  const projectName = context?.project?.name;
  const greeting =
    isFirstVisit && projectName
      ? `Hi! I'm Resto, your AI co-founder. I've reviewed your **${projectName}** project setup and I'm ready to help you bring it to life. I've created a startup checklist to guide us through the Plan, Build, Launch, and Grow stages. What would you like to work on first?`
      : "Hi! I'm Resto, your AI co-founder. How can I help with your project today?";

  // ─── Render ───────────────────────────────────────────────────────

  return (
    <CopilotChat
      className="flex-1"
      instructions={systemPrompt}
      labels={{
        title: "Resto",
        initial: greeting,
        placeholder: "Ask me anything about your project...",
      }}
    />
  );
}
