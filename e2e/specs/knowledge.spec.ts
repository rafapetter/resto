/**
 * Knowledge Base page tests — view, search, add document dialog.
 * Seeds the DB directly to avoid LLM-heavy KB creation via UI.
 */
import { test, expect } from "@playwright/test";
import {
  getTenantId,
  createTestProject,
  deleteTestProject,
  createTestKnowledgeFile,
  type TestProject,
} from "../helpers/db";

test.describe("Knowledge Base page", () => {
  let tenantId: string;
  let project: TestProject;

  test.beforeAll(async () => {
    tenantId = await getTenantId();
    project = await createTestProject(tenantId, "Knowledge E2E Suite");
    await createTestKnowledgeFile(tenantId, project.id, "Business Profile", "summary");
    await createTestKnowledgeFile(tenantId, project.id, "Technical Architecture", "detail");
  });

  test.afterAll(async () => {
    await deleteTestProject(project.id);
  });

  test("shows Knowledge Base heading and Add Document button", async ({ page }) => {
    await page.goto(`/projects/${project.id}/knowledge`);
    await expect(page.getByRole("heading", { name: "Knowledge Base" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Add Document/i })).toBeVisible();
  });

  test("shows seeded documents", async ({ page }) => {
    await page.goto(`/projects/${project.id}/knowledge`);
    await expect(page.getByText("Business Profile")).toBeVisible();
    await expect(page.getByText("Technical Architecture")).toBeVisible();
  });

  test("search filters documents by title", async ({ page }) => {
    await page.goto(`/projects/${project.id}/knowledge`);
    await page.getByPlaceholder(/Search documents/i).fill("Business");
    // Wait for debounce (300ms)
    await page.waitForTimeout(400);
    await expect(page.getByText("Business Profile")).toBeVisible();
    await expect(page.getByText("Technical Architecture")).not.toBeVisible();
  });

  test("clearing search shows all documents again", async ({ page }) => {
    await page.goto(`/projects/${project.id}/knowledge`);
    const searchInput = page.getByPlaceholder(/Search documents/i);
    await searchInput.fill("Business");
    await page.waitForTimeout(400);
    await searchInput.clear();
    await page.waitForTimeout(400);
    await expect(page.getByText("Technical Architecture")).toBeVisible();
  });

  test("search with no matches shows no-match message", async ({ page }) => {
    await page.goto(`/projects/${project.id}/knowledge`);
    await page.getByPlaceholder(/Search documents/i).fill("xyznotfound999");
    await page.waitForTimeout(400);
    await expect(page.getByText(/No documents match/i)).toBeVisible();
  });

  test("Add Document button opens dialog", async ({ page }) => {
    await page.goto(`/projects/${project.id}/knowledge`);
    await page.getByRole("button", { name: /Add Document/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Add Document")).toBeVisible();
  });

  test("Add Document dialog has title and content fields", async ({ page }) => {
    await page.goto(`/projects/${project.id}/knowledge`);
    await page.getByRole("button", { name: /Add Document/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Should have input fields for title and content
    await expect(page.getByRole("dialog").getByRole("textbox").first()).toBeVisible();
  });
});
