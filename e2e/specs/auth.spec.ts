/**
 * Auth redirect tests — verify unauthenticated users are redirected to sign-in.
 * These tests OVERRIDE the global storageState to simulate an unauthenticated session.
 */
import { test, expect } from "@playwright/test";

// Override: use empty session (no Clerk cookies)
test.use({ storageState: { cookies: [], origins: [] } });

test("visiting /projects without auth redirects to sign-in", async ({ page }) => {
  await page.goto("/projects");
  await expect(page).toHaveURL(/\/sign-in/);
});

test("visiting /settings without auth redirects to sign-in", async ({ page }) => {
  await page.goto("/settings");
  await expect(page).toHaveURL(/\/sign-in/);
});

test("visiting a project page without auth redirects to sign-in", async ({ page }) => {
  await page.goto("/projects/00000000-0000-0000-0000-000000000001/checklist");
  await expect(page).toHaveURL(/\/sign-in/);
});

test("homepage is publicly accessible without auth", async ({ page }) => {
  await page.goto("/");
  // Should stay on homepage — not redirected to sign-in
  await expect(page).not.toHaveURL(/\/sign-in/);
});

test("sign-in page is accessible without auth", async ({ page }) => {
  await page.goto("/sign-in");
  // Clerk renders the sign-in UI — the page should load without infinite redirect
  await expect(page).toHaveURL(/\/sign-in/);
  // Clerk component should be present in some form
  await expect(page.locator("body")).toBeVisible();
});
