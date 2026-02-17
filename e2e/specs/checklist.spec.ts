/**
 * Checklist page tests — CRUD, stage filtering, progress bar.
 * Uses beforeAll/afterAll to seed a project + items once per suite.
 */
import { test, expect } from "@playwright/test";
import {
  getTenantId,
  createTestProject,
  deleteTestProject,
  createTestChecklistItem,
  type TestProject,
} from "../helpers/db";

test.describe("Checklist page", () => {
  let tenantId: string;
  let project: TestProject;

  test.beforeAll(async () => {
    tenantId = await getTenantId();
    project = await createTestProject(tenantId, "Checklist E2E Suite");
    await createTestChecklistItem(tenantId, project.id, "Plan the architecture", "plan");
    await createTestChecklistItem(tenantId, project.id, "Build the MVP", "build");
    await createTestChecklistItem(tenantId, project.id, "Launch on Product Hunt", "launch");
  });

  test.afterAll(async () => {
    await deleteTestProject(project.id);
  });

  test("shows Checklist heading and Add Item button", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    await expect(page.getByRole("heading", { name: "Checklist" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Add Item/i })).toBeVisible();
  });

  test("shows seeded checklist items", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    await expect(page.getByText("Plan the architecture")).toBeVisible();
    await expect(page.getByText("Build the MVP")).toBeVisible();
    await expect(page.getByText("Launch on Product Hunt")).toBeVisible();
  });

  test("stage filter tabs are visible (All, plan, build, launch, grow)", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    await expect(page.getByRole("tab", { name: /all/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /plan/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /build/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /launch/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /grow/i })).toBeVisible();
  });

  test("filtering by 'build' stage shows only build items", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    await page.getByRole("tab", { name: /build/i }).click();
    await expect(page.getByText("Build the MVP")).toBeVisible();
    await expect(page.getByText("Plan the architecture")).not.toBeVisible();
    await expect(page.getByText("Launch on Product Hunt")).not.toBeVisible();
  });

  test("filtering by 'plan' stage shows only plan items", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    await page.getByRole("tab", { name: /plan/i }).click();
    await expect(page.getByText("Plan the architecture")).toBeVisible();
    await expect(page.getByText("Build the MVP")).not.toBeVisible();
  });

  test("Add Item button opens dialog", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    await page.getByRole("button", { name: /Add Item/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Add Checklist Item")).toBeVisible();
  });

  test("can create a new checklist item via dialog", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    await page.getByRole("button", { name: /Add Item/i }).click();

    // Fill in the title field in the dialog
    await page.getByRole("dialog").getByRole("textbox").first().fill("E2E Created Task");

    // Submit button in dialog
    const submitBtn = page.getByRole("dialog").getByRole("button", { name: /Add Item/i });
    await expect(submitBtn).toBeEnabled({ timeout: 3_000 });
    await submitBtn.click();

    // Dialog closes
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 8_000 });

    // New item appears in the list
    await expect(page.getByText("E2E Created Task")).toBeVisible();
  });

  test("shows progress bar when items exist", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    // Progress indicator: "X of Y complete" format
    await expect(page.getByText(/of.*complete/i)).toBeVisible();
  });

  test("empty filter shows no-match message", async ({ page }) => {
    await page.goto(`/projects/${project.id}/checklist`);
    // 'grow' stage has no seeded items
    await page.getByRole("tab", { name: /grow/i }).click();
    await expect(
      page.getByText(/No items match/i).or(page.getByText("No items found"))
    ).toBeVisible();
  });
});
