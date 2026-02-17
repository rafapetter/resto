/**
 * Integrations page tests — provider cards, connection status, URL banners.
 * Does NOT test actual OAuth flows (requires external provider).
 */
import { test, expect } from "../fixtures";

test.describe("Integrations page", () => {
  test("shows Integrations heading and subtext", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}/integrations`);
    await expect(page.getByRole("heading", { name: "Integrations" })).toBeVisible();
    await expect(
      page.getByText(/Connect external services/i)
    ).toBeVisible();
  });

  test("shows provider cards after loading", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}/integrations`);
    // Wait for skeleton loading to finish
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    // All 4 providers should be visible
    await expect(page.getByText("GitHub")).toBeVisible();
    await expect(page.getByText("Vercel")).toBeVisible();
    await expect(page.getByText("Stripe")).toBeVisible();
    await expect(page.getByText("Webhook")).toBeVisible();
  });

  test("Webhook provider shows Configure button (no OAuth)", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}/integrations`);
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    // Webhook uses API key auth — always shows Configure button (no OAuth required)
    await expect(page.getByRole("button", { name: "Configure" })).toBeVisible();
  });

  test("clicking Configure on Webhook opens dialog", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}/integrations`);
    await expect(
      page.locator('[class*="animate-pulse"]').first()
    ).not.toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: "Configure" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("success banner shows when ?connected=github URL param is present", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}/integrations?connected=github`);
    await expect(
      page.getByText(/Successfully connected github/i)
    ).toBeVisible({ timeout: 8_000 });
  });

  test("error banner shows when ?error=oauth_denied URL param is present", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}/integrations?error=oauth_denied`);
    // The integrations page maps 'oauth_denied' to a human-readable message
    await expect(
      page.getByText(/denied|failed|error/i).filter({ hasNot: page.getByText(/heading/i) })
    ).toBeVisible({ timeout: 8_000 });
  });

  test("banner is dismissible", async ({ testProject, page }) => {
    await page.goto(`/projects/${testProject.id}/integrations?connected=github`);
    const banner = page.getByText(/Successfully connected github/i);
    await expect(banner).toBeVisible({ timeout: 8_000 });

    // Click dismiss (×) button on the banner
    await page.getByRole("button", { name: /dismiss|close/i }).first().click();
    await expect(banner).not.toBeVisible({ timeout: 5_000 });
  });
});
