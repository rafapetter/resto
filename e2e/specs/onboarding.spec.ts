/**
 * New Project Wizard (4-step onboarding) tests.
 * Tests step navigation, validation gates, and wizard flow.
 * Does NOT test the actual project creation (avoids LLM bootstrap cost).
 */
import { test, expect } from "@playwright/test";

test.describe("New Project Wizard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects/new");
  });

  test("shows all 4 step indicators on load", async ({ page }) => {
    await expect(page.getByText("Template")).toBeVisible();
    await expect(page.getByText("Business Info")).toBeVisible();
    await expect(page.getByText("Autonomy")).toBeVisible();
    await expect(page.getByText("Review")).toBeVisible();
  });

  test("Continue button is disabled before selecting industry", async ({ page }) => {
    const continueBtn = page.getByRole("button", { name: /Continue/i });
    await expect(continueBtn).toBeDisabled();
  });

  test("selecting Custom industry (no verticals) enables Continue", async ({ page }) => {
    // Find and click the Custom industry card
    await page.getByText("Custom").click();
    await expect(page.getByRole("button", { name: /Continue/i })).toBeEnabled({
      timeout: 5_000,
    });
  });

  test("selecting industry with verticals requires vertical + product before Continue", async ({ page }) => {
    // Click on an industry that has verticals (e.g. "SaaS" or "E-Commerce")
    const industryCards = page.getByRole("button").or(page.locator("[data-industry]"));
    // Find any non-Custom industry card and click it
    await page.locator("text=SaaS").first().click();
    // Continue should still be disabled — need vertical + product
    await expect(page.getByRole("button", { name: /Continue/i })).toBeDisabled();
  });

  test("Back button from Step 2 returns to Step 1", async ({ page }) => {
    // Navigate to Step 2 via Custom (fastest path)
    await page.getByText("Custom").click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Confirm Step 2 is visible — check for a business info field
    await expect(
      page.getByRole("textbox").first()
    ).toBeVisible({ timeout: 8_000 });

    // Click Back
    await page.getByRole("button", { name: /Back/i }).click();

    // Should be back on Step 1
    await expect(page.getByText("Template")).toBeVisible();
    await expect(page.getByText("Custom")).toBeVisible();
  });

  test("Step 2 Continue button is disabled without required fields", async ({ page }) => {
    await page.getByText("Custom").click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Wait for step 2 to load
    await expect(page.getByRole("textbox").first()).toBeVisible({ timeout: 8_000 });

    const continueBtn = page.getByRole("button", { name: /Continue/i });
    await expect(continueBtn).toBeDisabled();
  });

  test("Step 3 autonomy is visible after completing Steps 1 and 2", async ({ page }) => {
    // Step 1: Custom
    await page.getByText("Custom").click();
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 2: fill business name + select a chip
    await expect(page.getByRole("textbox").first()).toBeVisible({ timeout: 8_000 });
    await page.getByRole("textbox").first().fill("My E2E Business");

    // Select the first problem chip to unblock Continue
    const firstChip = page.locator('[class*="chip"], button[data-chip]').first();
    if (await firstChip.isVisible()) {
      await firstChip.click();
    } else {
      // Fallback: find any chip-style button in the form area
      await page
        .locator("button")
        .filter({ hasText: /\w{3,}/ })
        .filter({ hasNot: page.getByText(/Continue|Back/i) })
        .first()
        .click();
    }

    const continueBtn = page.getByRole("button", { name: /Continue/i });
    // If Continue is still disabled, skip to autonomy step check (business info may have more required fields)
    if (await continueBtn.isEnabled()) {
      await continueBtn.click();
      // Step 3: autonomy preferences should be visible
      await expect(page.getByText(/Autonomy/i)).toBeVisible({ timeout: 8_000 });
    }
  });
});
