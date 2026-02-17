"use client";

import { CopilotKit, useCopilotChatInternal } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import {
  useCopilotReadable,
  useCopilotAction,
} from "@copilotkit/react-core";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildSystemPrompt } from "@/lib/agent/prompts/system";
import { AutonomyActionRenderer } from "./actions/autonomy-action-renderer";
import { useChatPersistence } from "@/hooks/use-chat-persistence";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { useVoiceOutput } from "@/hooks/use-voice-output";
import { VoiceButton } from "./voice-button";
import { useState, useEffect, useRef, useCallback } from "react";
import "@copilotkit/react-ui/styles.css";

type Props = {
  projectId: string;
};

export function RestoChat({ projectId }: Props) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" properties={{ projectId }}>
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

  // ─── Chat persistence (auto-save/restore) ──────────────────────────

  const { isLoading: isRestoring, messageCount } = useChatPersistence(projectId);

  const isFirstVisit = context?.project && messageCount === 0;

  // ─── Voice interface ──────────────────────────────────────────────

  const { messages, sendMessage } = useCopilotChatInternal();
  const [voiceMode, setVoiceMode] = useState(false);
  const { speak, stop: stopSpeaking, isSpeaking } = useVoiceOutput();
  const prevMessageCountRef = useRef(0);

  // Auto-play TTS when a new assistant message arrives and voice mode is on
  useEffect(() => {
    if (!voiceMode || messages.length <= prevMessageCountRef.current) {
      prevMessageCountRef.current = messages.length;
      return;
    }
    prevMessageCountRef.current = messages.length;
    const last = messages[messages.length - 1];
    // AG-UI messages: plain objects { id, role, content }
    if (last?.role === "assistant" && typeof last.content === "string") {
      void speak(last.content);
    }
  }, [messages, voiceMode, speak]);

  const sendVoiceMessage = useCallback(
    (transcript: string) => {
      void sendMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: transcript,
      });
    },
    [sendMessage]
  );

  const voiceInput = useVoiceInput(sendVoiceMessage);

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
  const generateCodeMut = useMutation(
    trpc.codegen.generate.mutationOptions({})
  );
  const createRepoMut = useMutation(
    trpc.github.createRepo.mutationOptions({})
  );
  const pushCodeMut = useMutation(
    trpc.github.pushCode.mutationOptions({})
  );
  const createVercelProjectMut = useMutation(
    trpc.deploy.createProject.mutationOptions({})
  );
  const triggerDeployMut = useMutation(
    trpc.deploy.triggerDeployment.mutationOptions({})
  );

  // ─── Actions with autonomy ─────────────────────────────────────

  useCopilotAction({
    name: "searchKnowledgeBase",
    description:
      "Search the project knowledge base for relevant information about the business, plans, or technical decisions.",
    parameters: [
      {
        name: "query",
        type: "string" as const,
        description: "Natural language search query",
        required: true,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="knowledge_management"
        actionName="searchKnowledgeBase"
        risk="low"
        projectId={projectId}
        description={`Search knowledge base for: "${args.query ?? ""}"`}
        execute={async () => {
          const results = await searchKB.mutateAsync({
            projectId,
            query: args.query as string,
          });
          return results;
        }}
      />
    ),
  });

  useCopilotAction({
    name: "createKnowledgeEntry",
    description:
      "Create a new knowledge base document to store project information, decisions, or research.",
    parameters: [
      {
        name: "title",
        type: "string" as const,
        description: "Document title",
        required: true,
      },
      {
        name: "content",
        type: "string" as const,
        description: "Document content in markdown format",
        required: true,
      },
      {
        name: "tier",
        type: "string" as const,
        description:
          "Document tier: 'index' for quick reference, 'summary' for overviews, 'detail' for full docs",
        required: true,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="knowledge_management"
        actionName="createKnowledgeEntry"
        risk="low"
        projectId={projectId}
        description={`Create knowledge entry: "${args.title ?? ""}"`}
        execute={async () => {
          const result = await createKB.mutateAsync({
            projectId,
            title: args.title as string,
            content: args.content as string,
            tier: args.tier as "index" | "summary" | "detail",
          });
          await queryClient.invalidateQueries({
            queryKey: trpc.knowledgeBase.list.queryKey({ projectId }),
          });
          return result;
        }}
      />
    ),
  });

  useCopilotAction({
    name: "createChecklistItem",
    description:
      "Add a new item to the project checklist to track tasks and milestones.",
    parameters: [
      {
        name: "title",
        type: "string" as const,
        description: "Task title",
        required: true,
      },
      {
        name: "description",
        type: "string" as const,
        description: "Task description with details",
        required: false,
      },
      {
        name: "stage",
        type: "string" as const,
        description:
          "Project stage: 'plan', 'build', 'launch', or 'grow'",
        required: true,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="knowledge_management"
        actionName="createChecklistItem"
        risk="low"
        projectId={projectId}
        description={`Add checklist item: "${args.title ?? ""}" to ${args.stage ?? ""} stage`}
        execute={async () => {
          const result = await createTask.mutateAsync({
            projectId,
            title: args.title as string,
            description: args.description as string | undefined,
            stage: args.stage as "plan" | "build" | "launch" | "grow",
          });
          await queryClient.invalidateQueries({
            queryKey: trpc.tasks.list.queryKey({ projectId }),
          });
          await queryClient.invalidateQueries({
            queryKey: trpc.projects.getFullContext.queryKey({ projectId }),
          });
          return result;
        }}
      />
    ),
  });

  useCopilotAction({
    name: "updateChecklistItem",
    description:
      "Update the status of a checklist item to track progress.",
    parameters: [
      {
        name: "id",
        type: "string" as const,
        description: "The checklist item ID",
        required: true,
      },
      {
        name: "status",
        type: "string" as const,
        description:
          "New status: 'pending', 'in_progress', 'blocked', 'completed', or 'skipped'",
        required: true,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="knowledge_management"
        actionName="updateChecklistItem"
        risk="low"
        projectId={projectId}
        description={`Update checklist item status to: ${args.status ?? ""}`}
        execute={async () => {
          const result = await updateTaskStatus.mutateAsync({
            id: args.id as string,
            status: args.status as
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
        }}
      />
    ),
  });

  // ─── Read-only actions (no autonomy needed) ───────────────────────

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

  // ─── Integration setup (with autonomy) ────────────────────────────

  useCopilotAction({
    name: "getIntegrationSetupUrl",
    description:
      "Get the setup URL or instructions for connecting a specific integration provider (github, vercel, stripe, webhook).",
    parameters: [
      {
        name: "provider",
        type: "string" as const,
        description: "The provider ID: github, vercel, stripe, or webhook",
        required: true,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="integrations"
        actionName="getIntegrationSetupUrl"
        risk="medium"
        projectId={projectId}
        description={`Get setup URL for ${args.provider ?? ""} integration`}
        execute={async () => {
          const providers = await queryClient.fetchQuery(
            trpc.credentials.providers.queryOptions({ projectId })
          );
          const p = providers.find((pr) => pr.id === args.provider);
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
              provider: args.provider as string,
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
        }}
      />
    ),
  });

  // ─── Code generation & deployment (with autonomy) ─────────────────

  useCopilotAction({
    name: "generateCode",
    description:
      "Generate application code using AI. Describe what you want built and the agent will create all the files.",
    parameters: [
      {
        name: "description",
        type: "string" as const,
        description:
          "Detailed description of the application or feature to generate",
        required: true,
      },
      {
        name: "framework",
        type: "string" as const,
        description:
          "Framework to use: 'nextjs' (default), 'react', 'express', etc.",
        required: false,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="code_generation"
        actionName="generateCode"
        risk="medium"
        projectId={projectId}
        description={`Generate code: "${(args.description as string | undefined)?.slice(0, 80) ?? ""}"`}
        execute={async () => {
          const result = await generateCodeMut.mutateAsync({
            projectId,
            description: args.description as string,
            framework: (args.framework as string | undefined) ?? "nextjs",
          });
          return result;
        }}
      />
    ),
  });

  useCopilotAction({
    name: "createRepository",
    description:
      "Create a new GitHub repository for the project's code.",
    parameters: [
      {
        name: "name",
        type: "string" as const,
        description: "Repository name (lowercase, no spaces)",
        required: true,
      },
      {
        name: "description",
        type: "string" as const,
        description: "Repository description",
        required: false,
      },
      {
        name: "isPrivate",
        type: "boolean" as const,
        description: "Whether the repo should be private (default: true)",
        required: false,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="code_generation"
        actionName="createRepository"
        risk="medium"
        projectId={projectId}
        description={`Create GitHub repo: "${args.name ?? ""}"`}
        execute={async () => {
          const repo = await createRepoMut.mutateAsync({
            projectId,
            name: args.name as string,
            description: args.description as string | undefined,
            isPrivate: (args.isPrivate as boolean | undefined) ?? true,
          });
          return repo;
        }}
      />
    ),
  });

  useCopilotAction({
    name: "pushCodeToRepo",
    description:
      "Push generated code files to a GitHub repository in a single commit.",
    parameters: [
      {
        name: "owner",
        type: "string" as const,
        description: "GitHub username or organization",
        required: true,
      },
      {
        name: "repo",
        type: "string" as const,
        description: "Repository name",
        required: true,
      },
      {
        name: "commitMessage",
        type: "string" as const,
        description: "Commit message describing the changes",
        required: true,
      },
      {
        name: "files",
        type: "object[]" as const,
        description: "Array of files to push, each with path and content",
        required: true,
      },
      {
        name: "branch",
        type: "string" as const,
        description: "Branch to push to (default: main)",
        required: false,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="code_generation"
        actionName="pushCodeToRepo"
        risk="high"
        projectId={projectId}
        description={`Push code to ${args.owner ?? ""}/${args.repo ?? ""}`}
        execute={async () => {
          const result = await pushCodeMut.mutateAsync({
            projectId,
            owner: args.owner as string,
            repo: args.repo as string,
            branch: (args.branch as string | undefined) ?? "main",
            commitMessage: args.commitMessage as string,
            files: args.files as Array<{ path: string; content: string }>,
          });
          return result;
        }}
      />
    ),
  });

  useCopilotAction({
    name: "createVercelProject",
    description:
      "Create a Vercel project linked to a GitHub repository for deployment.",
    parameters: [
      {
        name: "name",
        type: "string" as const,
        description: "Vercel project name",
        required: true,
      },
      {
        name: "githubRepo",
        type: "string" as const,
        description: "GitHub repo in 'owner/repo' format",
        required: true,
      },
      {
        name: "framework",
        type: "string" as const,
        description: "Framework: 'nextjs', 'vite', 'remix', etc. (default: nextjs)",
        required: false,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="deployment"
        actionName="createVercelProject"
        risk="high"
        projectId={projectId}
        description={`Create Vercel project: "${args.name ?? ""}"`}
        execute={async () => {
          const project = await createVercelProjectMut.mutateAsync({
            projectId,
            name: args.name as string,
            githubRepo: args.githubRepo as string,
            framework: (args.framework as string | undefined) ?? "nextjs",
          });
          return project;
        }}
      />
    ),
  });

  useCopilotAction({
    name: "deployProject",
    description:
      "Trigger a deployment on Vercel for the project.",
    parameters: [
      {
        name: "vercelProjectName",
        type: "string" as const,
        description: "The Vercel project name to deploy",
        required: true,
      },
      {
        name: "target",
        type: "string" as const,
        description: "Deploy target: 'production' or 'preview' (default: production)",
        required: false,
      },
    ],
    renderAndWaitForResponse: ({ args, status, respond }) => (
      <AutonomyActionRenderer
        status={status}
        args={args as Record<string, unknown>}
        respond={respond}
        category="deployment"
        actionName="deployProject"
        risk="high"
        projectId={projectId}
        description={`Deploy ${args.vercelProjectName ?? ""} to ${(args.target as string | undefined) ?? "production"}`}
        execute={async () => {
          const deployment = await triggerDeployMut.mutateAsync({
            projectId,
            vercelProjectName: args.vercelProjectName as string,
            target:
              ((args.target as string | undefined) ?? "production") as
                | "production"
                | "preview",
          });
          return deployment;
        }}
      />
    ),
  });

  useCopilotAction({
    name: "checkDeploymentStatus",
    description:
      "Check the status of a Vercel deployment.",
    parameters: [
      {
        name: "deploymentId",
        type: "string" as const,
        description: "The Vercel deployment ID to check",
        required: true,
      },
    ],
    handler: async (args) => {
      const status = await queryClient.fetchQuery(
        trpc.deploy.getDeploymentStatus.queryOptions({
          projectId,
          deploymentId: args.deploymentId as string,
        })
      );
      return status;
    },
  });

  // ─── Greeting ─────────────────────────────────────────────────────

  const projectName = context?.project?.name;
  const greeting =
    isFirstVisit && projectName
      ? `Hi! I'm Resto, your AI co-founder. I've reviewed your **${projectName}** project setup and I'm ready to help you bring it to life. I've created a startup checklist to guide us through the Plan, Build, Launch, and Grow stages. What would you like to work on first?`
      : "Hi! I'm Resto, your AI co-founder. How can I help with your project today?";

  // ─── Render ───────────────────────────────────────────────────────

  if (isRestoring || !context) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Loading conversation...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <CopilotChat
        className="flex-1"
        instructions={systemPrompt}
        labels={{
          title: "Resto",
          initial: greeting,
          placeholder: "Ask me anything about your project...",
        }}
      />
      <VoiceButton
        voiceMode={voiceMode}
        onToggleVoiceMode={() => {
          setVoiceMode((v) => !v);
          stopSpeaking();
        }}
        recordingState={voiceInput.state}
        onStartRecording={voiceInput.start}
        onStopRecording={voiceInput.stop}
        isSpeaking={isSpeaking}
        onStopSpeaking={stopSpeaking}
        isSupported={voiceInput.isSupported}
      />
    </div>
  );
}
