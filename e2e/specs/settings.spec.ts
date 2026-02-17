/**
 * Settings page tests — account card, autonomy preferences.
 */
import { test, expect } from "@playwright/test";

test.describe("Settings page", () => {
  test("shows Settings heading", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("shows Account section", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByText("Account")).toBeVisible();
  });

  test("shows Autonomy Preferences section", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByText("Autonomy Preferences")).toBeVisible();
  });

  test("autonomy section loads after data resolves", async ({ page }) => {
    await page.goto("/settings");
    // Wait for skeleton/loading to finish
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });
    // The autonomy preferences card should be visible
    await expect(page.getByText("Autonomy Preferences")).toBeVisible();
  });

  test("Manage Account link exists and points to /user-profile", async ({ page }) => {
    await page.goto("/settings");
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    const manageLink = page.getByRole("link", { name: /Manage Account/i });
    await expect(manageLink).toBeVisible();
    await expect(manageLink).toHaveAttribute("href", "/user-profile");
  });

  test("authenticated user email is displayed in Account section", async ({ page }) => {
    await page.goto("/settings");
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    const email = process.env.E2E_CLERK_USER_EMAIL;
    if (email) {
      await expect(page.getByText(email)).toBeVisible({ timeout: 8_000 });
    } else {
      // If no email env var, just verify the account section rendered
      await expect(page.getByText("Account")).toBeVisible();
    }
  });
});
