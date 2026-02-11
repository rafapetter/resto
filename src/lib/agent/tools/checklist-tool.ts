import { db } from "@/server/db";
import { checklistItems } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { ActionResult } from "../actions";

export async function updateChecklistStatus(
  tenantId: string,
  itemId: string,
  status: "pending" | "in_progress" | "blocked" | "completed" | "skipped"
): Promise<ActionResult> {
  try {
    const [updated] = await db
      .update(checklistItems)
      .set({ status })
      .where(
        and(
          eq(checklistItems.id, itemId),
          eq(checklistItems.tenantId, tenantId)
        )
      )
      .returning();

    if (!updated) {
      return { success: false, error: "Checklist item not found" };
    }

    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createChecklistItem(
  tenantId: string,
  projectId: string,
  title: string,
  stage: "plan" | "build" | "launch" | "grow",
  description?: string
): Promise<ActionResult> {
  try {
    const [item] = await db
      .insert(checklistItems)
      .values({
        tenantId,
        projectId,
        title,
        description,
        stage,
      })
      .returning();

    return { success: true, data: item };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
