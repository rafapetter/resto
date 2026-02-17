/**
 * Projects list page tests.
 * Uses the authenticated session from auth.setup.ts.
 */
import { test, expect } from "../fixtures";

test.describe("Projects page", () => {
  test("shows heading and New Project button", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(page.getByRole("link", { name: /New Project/i })).toBeVisible();
  });

  test("New Project button navigates to /projects/new", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("link", { name: /New Project/i }).click();
    await expect(page).toHaveURL("/projects/new");
  });

  test("loading skeleton disappears after data loads", async ({ page }) => {
    await page.goto("/projects");
    // Wait for the skeleton loading state to resolve
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });
  });

  test("pre-created project appears in the list", async ({ testProject, page }) => {
    await page.goto("/projects");
    // Wait for loading
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });
    // Test project should be visible
    await expect(page.getByText(testProject.name)).toBeVisible();
  });

  test("clicking project card navigates to project detail", async ({ testProject, page }) => {
    await page.goto("/projects");
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });
    // Click the project card/link
    await page.getByText(testProject.name).click();
    await expect(page).toHaveURL(`/projects/${testProject.id}`);
  });
});
