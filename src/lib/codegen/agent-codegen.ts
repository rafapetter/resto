import "server-only";
import { query, type SDKResultSuccess } from "@anthropic-ai/claude-agent-sdk";
import { mkdtemp, rm, readdir, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { KnowledgeBaseService } from "@/lib/knowledge/service";
import { buildCodeGenPrompt } from "./prompts";

// ─── Types ──────────────────────────────────────────────────────────

export type GeneratedFile = { path: string; content: string };

export type CodeGenResult = {
  files: GeneratedFile[];
  summary: string;
  cost: number;
  inputTokens: number;
  outputTokens: number;
};

// ─── Main function ──────────────────────────────────────────────────

export async function generateCode(params: {
  projectId: string;
  tenantId: string;
  description: string;
  framework?: string;
}): Promise<CodeGenResult> {
  const kbService = new KnowledgeBaseService();

  // 1. Search KB for project context
  let contextStr = "";
  try {
    const results = await kbService.search(
      params.projectId,
      params.tenantId,
      params.description,
      5
    );
    contextStr = results
      .map((r) => `${r.title}: ${r.chunkContent}`)
      .join("\n---\n");
  } catch {
    // KB search is best-effort; continue without context
  }

  // 2. Create temp working directory
  const workDir = await mkdtemp(join(tmpdir(), "atr-codegen-"));

  try {
    // 3. Build prompt with project context
    const prompt = buildCodeGenPrompt({
      description: params.description,
      framework: params.framework ?? "nextjs",
      projectContext: contextStr,
    });

    // 4. Run Claude Agent SDK
    let summary = "";
    let cost = 0;
    let inputTokens = 0;
    let outputTokens = 0;

    for await (const message of query({
      prompt,
      options: {
        cwd: workDir,
        tools: ["Write", "Edit", "Bash", "Glob", "Grep", "Read"],
        permissionMode: "bypassPermissions",
        allowDangerouslySkipPermissions: true,
        model: "claude-sonnet-4-5-20250929",
        maxTurns: 30,
        maxBudgetUsd: 10,
        persistSession: false,
        settingSources: [],
        systemPrompt:
          "You are a senior full-stack developer generating production code. " +
          "Write files directly to the current directory. Do not ask questions — " +
          "use your best judgment. After generating all files, provide a brief " +
          "summary of what you created.",
      },
    })) {
      if (message.type === "result") {
        if (message.subtype === "success") {
          const success = message as SDKResultSuccess;
          summary = success.result ?? "";
          cost = success.total_cost_usd ?? 0;
          inputTokens = success.usage?.input_tokens ?? 0;
          outputTokens = success.usage?.output_tokens ?? 0;
        } else {
          const errors =
            "errors" in message
              ? (message.errors as string[]).join(", ")
              : "Unknown error";
          throw new Error(`Code generation failed: ${errors}`);
        }
      }
    }

    // 5. Collect all generated files from disk
    const files = await collectFiles(workDir);

    if (files.length === 0) {
      throw new Error(
        "Code generation completed but no files were created. Try being more specific about what you need."
      );
    }

    return { files, summary, cost, inputTokens, outputTokens };
  } finally {
    // 6. Cleanup temp directory
    await rm(workDir, { recursive: true, force: true });
  }
}

// ─── File collection ────────────────────────────────────────────────

async function collectFiles(
  dir: string,
  basePath = ""
): Promise<GeneratedFile[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: GeneratedFile[] = [];

  for (const entry of entries) {
    const relativePath = basePath
      ? `${basePath}/${entry.name}`
      : entry.name;

    // Skip hidden files, node_modules, and other noise
    if (
      entry.name.startsWith(".") ||
      entry.name === "node_modules" ||
      entry.name === "__pycache__"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(
        ...(await collectFiles(join(dir, entry.name), relativePath))
      );
    } else {
      try {
        const content = await readFile(
          join(dir, entry.name),
          "utf-8"
        );
        files.push({ path: relativePath, content });
      } catch {
        // Skip binary files or files that can't be read as UTF-8
      }
    }
  }

  return files;
}
