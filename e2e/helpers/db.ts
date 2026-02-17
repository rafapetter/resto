/**
 * Direct DB helpers for E2E test setup/teardown.
 * Uses raw `pg` (not Drizzle) to avoid importing `server-only` modules
 * into the Playwright Node.js test runner context.
 *
 * Architecture:
 *   tenants.clerk_user_id → tenants.id (UUID) → projects.tenant_id
 */
import { Client } from "pg";

function makeClient(): Client {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL env var is required for E2E DB helpers");
  return new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
}

export type TestProject = { id: string; name: string };

/**
 * Resolve the Clerk user ID to the tenant UUID used in the DB.
 * The E2E test user must have already signed in (webhook creates the tenant).
 */
export async function getTenantId(): Promise<string> {
  const clerkUserId = process.env.E2E_CLERK_USER_ID;
  if (!clerkUserId) throw new Error("E2E_CLERK_USER_ID env var is required");

  const client = makeClient();
  await client.connect();
  try {
    const res = await client.query<{ id: string }>(
      "SELECT id FROM tenants WHERE clerk_user_id = $1",
      [clerkUserId]
    );
    if (res.rows.length === 0) {
      throw new Error(
        `No tenant found for clerk_user_id=${clerkUserId}. ` +
          "Ensure the E2E test user has signed in at least once so the Clerk webhook creates their tenant."
      );
    }
    return res.rows[0].id;
  } finally {
    await client.end();
  }
}

/**
 * Create a test project directly in the DB.
 * Cleaned up via deleteTestProject in afterAll/afterEach.
 */
export async function createTestProject(
  tenantId: string,
  name = "E2E Test Project"
): Promise<TestProject> {
  const client = makeClient();
  await client.connect();
  try {
    const res = await client.query<{ id: string; name: string }>(
      `INSERT INTO projects (tenant_id, name, status)
       VALUES ($1, $2, 'draft')
       RETURNING id, name`,
      [tenantId, name]
    );
    return res.rows[0];
  } finally {
    await client.end();
  }
}

/**
 * Delete a project and all its child records (cascade via FK constraints).
 */
export async function deleteTestProject(projectId: string): Promise<void> {
  const client = makeClient();
  await client.connect();
  try {
    await client.query("DELETE FROM projects WHERE id = $1", [projectId]);
  } finally {
    await client.end();
  }
}

/**
 * Create a checklist item directly in the DB for a given project.
 */
export async function createTestChecklistItem(
  tenantId: string,
  projectId: string,
  title: string,
  stage: "plan" | "build" | "launch" | "grow" = "plan"
): Promise<string> {
  const client = makeClient();
  await client.connect();
  try {
    const res = await client.query<{ id: string }>(
      `INSERT INTO checklist_items (tenant_id, project_id, title, stage, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id`,
      [tenantId, projectId, title, stage]
    );
    return res.rows[0].id;
  } finally {
    await client.end();
  }
}

/**
 * Create a knowledge file record directly in the DB.
 * Note: No actual blob is created — the file record points to a placeholder URL.
 */
export async function createTestKnowledgeFile(
  tenantId: string,
  projectId: string,
  title: string,
  tier: "index" | "summary" | "detail" = "summary"
): Promise<string> {
  const client = makeClient();
  await client.connect();
  try {
    const res = await client.query<{ id: string }>(
      `INSERT INTO knowledge_files (tenant_id, project_id, title, tier, blob_url, size_bytes, line_count, char_count)
       VALUES ($1, $2, $3, $4, 'https://placeholder.e2e/test', 100, 5, 100)
       RETURNING id`,
      [tenantId, projectId, title, tier]
    );
    return res.rows[0].id;
  } finally {
    await client.end();
  }
}
