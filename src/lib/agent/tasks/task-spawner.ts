import { KnowledgeBaseService } from "@/lib/knowledge/service";
import { runTask } from "./task-runner";
import type { SpawnParams, TaskInstance } from "./task-types";

const kb = new KnowledgeBaseService();

let taskCounter = 0;

function generateTaskId(): string {
  taskCounter++;
  return `task_${Date.now()}_${taskCounter}`;
}

export async function spawnTask(params: SpawnParams): Promise<TaskInstance> {
  // Load relevant knowledge context
  let knowledgeContext = "";
  if (params.knowledgeQuery) {
    const results = await kb.search(
      params.projectId,
      params.tenantId,
      params.knowledgeQuery,
      3
    );
    knowledgeContext = results
      .map((r) => `[${r.tier}] ${r.title}:\n${r.chunkContent}`)
      .join("\n\n---\n\n");
  }

  if (!knowledgeContext) {
    // Fall back to project context
    knowledgeContext = await kb.getContextForProject(
      params.projectId,
      params.tenantId
    );
  }

  const task: TaskInstance = {
    id: generateTaskId(),
    taskType: params.taskType,
    description: params.description,
    status: "pending",
    projectId: params.projectId,
    tenantId: params.tenantId,
    context: params.context,
    knowledgeContext,
    startedAt: new Date(),
  };

  // Run task asynchronously
  runTask(task).catch((error) => {
    task.status = "failed";
    task.error = error instanceof Error ? error.message : "Unknown error";
    task.completedAt = new Date();
  });

  return task;
}

export async function spawnParallelTasks(
  paramsList: SpawnParams[]
): Promise<TaskInstance[]> {
  return Promise.all(paramsList.map(spawnTask));
}
