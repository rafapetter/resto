import { KnowledgeBaseService } from "@/lib/knowledge/service";
import type { KnowledgeTier } from "@/lib/knowledge/types";
import type { ActionResult } from "../actions";

const knowledgeService = new KnowledgeBaseService();

export async function searchKnowledge(
  projectId: string,
  query: string,
  tenantId?: string
): Promise<ActionResult> {
  if (!tenantId) {
    return { success: false, error: "Tenant ID is required for knowledge search." };
  }

  try {
    const results = await knowledgeService.search(projectId, tenantId, query);
    return {
      success: true,
      data: {
        results: results.map((r) => ({
          title: r.title,
          tier: r.tier,
          content: r.chunkContent,
          similarity: r.similarity,
        })),
        message: results.length > 0
          ? `Found ${results.length} relevant knowledge entries.`
          : "No matching knowledge entries found.",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Knowledge search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function updateKnowledge(
  projectId: string,
  title: string,
  content: string,
  tier: string,
  tenantId?: string
): Promise<ActionResult> {
  if (!tenantId) {
    return { success: false, error: "Tenant ID is required for knowledge updates." };
  }

  const validTiers: KnowledgeTier[] = ["index", "summary", "detail"];
  if (!validTiers.includes(tier as KnowledgeTier)) {
    return { success: false, error: `Invalid tier "${tier}". Must be one of: ${validTiers.join(", ")}` };
  }

  try {
    const files = await knowledgeService.create({
      tenantId,
      projectId,
      tier: tier as KnowledgeTier,
      title,
      content,
    });

    return {
      success: true,
      data: {
        files: files.map((f) => ({ id: f.id, title: f.title, tier: f.tier })),
        message: `Created ${files.length} knowledge file(s) in the ${tier} tier.`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Knowledge update failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
