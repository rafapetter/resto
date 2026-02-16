export type AgentAction =
  | { type: "update_knowledge"; payload: { title: string; content: string; tier: string } }
  | { type: "search_knowledge"; payload: { query: string } }
  | { type: "spawn_task"; payload: { taskType: string; context: Record<string, unknown> } }
  | { type: "update_checklist"; payload: { itemId: string; status: string } }
  | { type: "create_checklist_item"; payload: { title: string; stage: string; description?: string } }
  | { type: "generate_code"; payload: { description: string; framework?: string } }
  | { type: "create_repo"; payload: { name: string; description?: string; isPrivate?: boolean } }
  | { type: "push_code"; payload: { owner: string; repo: string; files: Array<{ path: string; content: string }> } }
  | { type: "create_vercel_project"; payload: { name: string; githubRepo: string; framework?: string } }
  | { type: "deploy"; payload: { vercelProjectName: string; target?: string } };

export type ActionResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export function describeActions(): string {
  return [
    "Available actions:",
    "- update_knowledge: Create or update a knowledge base file",
    "- search_knowledge: Search the knowledge base semantically",
    "- spawn_task: Create a new background task (e.g., code generation, deployment)",
    "- update_checklist: Update the status of a checklist item",
    "- create_checklist_item: Add a new item to the project checklist",
    "- generate_code: Generate application code using AI",
    "- create_repo: Create a new GitHub repository",
    "- push_code: Push code files to a GitHub repository",
    "- create_vercel_project: Create a Vercel project linked to GitHub",
    "- deploy: Trigger a deployment on Vercel",
  ].join("\n");
}
