import { db } from "@/server/db";
import { auditLog } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function logAuditEntry(
  tenantId: string,
  action: string,
  performedBy: string,
  details?: Record<string, unknown>,
  projectId?: string
) {
  await db.insert(auditLog).values({
    tenantId,
    projectId,
    action,
    performedBy,
    details,
  });
}

export async function getAuditLog(
  tenantId: string,
  options?: {
    projectId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const conditions = [eq(auditLog.tenantId, tenantId)];
  if (options?.projectId) {
    conditions.push(eq(auditLog.projectId, options.projectId));
  }

  return db.query.auditLog.findMany({
    where: and(...conditions),
    orderBy: [desc(auditLog.createdAt)],
    limit: options?.limit ?? 50,
    offset: options?.offset ?? 0,
  });
}
