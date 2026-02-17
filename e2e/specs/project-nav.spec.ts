/**
 * Project detail page and section navigation tests.
 * Uses the testProject fixture (created via DB, not UI).
 */
import { test, expect } from "../fixtures";

test.describe("Project detail navigation", () => {
  test("project detail page shows all 4 section cards", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}`);

    // Wait for loading skeleton to resolve
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    // Section card titles from the page
    await expect(page.getByText("Chat")).toBeVisible();
    await expect(page.getByText("Checklist")).toBeVisible();
    await expect(page.getByText("Knowledge Base")).toBeVisible();
    await expect(page.getByText("Integrations")).toBeVisible();
  });

  test("clicking Chat section card navigates to chat page", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}`);
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    // Find and click the Chat card link
    await page.getByRole("link", { name: /Chat/i }).first().click();
    await expect(page).toHaveURL(`/projects/${testProject.id}/chat`);
  });

  test("clicking Checklist section card navigates to checklist page", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}`);
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    await page.getByRole("link", { name: /Checklist/i }).first().click();
    await expect(page).toHaveURL(`/projects/${testProject.id}/checklist`);
    await expect(page.getByRole("heading", { name: "Checklist" })).toBeVisible();
  });

  test("clicking Knowledge Base section card navigates to knowledge page", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}`);
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    await page.getByRole("link", { name: /Knowledge Base/i }).first().click();
    await expect(page).toHaveURL(`/projects/${testProject.id}/knowledge`);
    await expect(page.getByRole("heading", { name: "Knowledge Base" })).toBeVisible();
  });

  test("sidebar shows project section nav when inside a project", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}/checklist`);

    // AppSidebar shows project-level nav (Chat, Checklist, etc.) when on a project route
    await expect(page.getByRole("link", { name: "Chat" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Checklist" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Knowledge Base" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Integrations" })).toBeVisible();
  });

  test("navigating to invalid project ID shows error or not-found", async ({ page }) => {
    await page.goto("/projects/00000000-0000-0000-0000-000000000000");
    // Next.js notFound() → 404 page, or the component renders an error state
    const body = page.locator("body");
    await expect(body).toBeVisible();
    // Should not show the normal project detail content
    await expect(page.getByText(/Knowledge Base|Chat|Checklist/)).not.toBeVisible({
      timeout: 8_000,
    });
  });
});
