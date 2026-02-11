import { routeAndCall } from "@/lib/llm/router";
import { getTaskPrompt } from "../prompts/task-prompts";
import type { TaskInstance } from "./task-types";

export async function runTask(task: TaskInstance): Promise<void> {
  task.status = "running";

  try {
    const systemPrompt = getTaskPrompt(task.taskType, {
      description: task.description,
      context: task.context,
      knowledgeContext: task.knowledgeContext,
    });

    const response = await routeAndCall(
      {
        messages: [
          {
            role: "user",
            content: task.description,
          },
        ],
        systemPrompt,
        maxTokens: 4096,
      },
      task.description,
      {
        tenantId: task.tenantId,
        projectId: task.projectId,
        taskType: task.taskType,
      }
    );

    task.result = {
      content: response.content,
      model: response.model,
      provider: response.provider,
      usage: response.usage,
    };
    task.status = "completed";
    task.completedAt = new Date();
  } catch (error) {
    task.status = "failed";
    task.error = error instanceof Error ? error.message : "Unknown error";
    task.completedAt = new Date();
    throw error;
  }
}
