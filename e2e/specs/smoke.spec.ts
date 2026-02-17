/**
 * Smoke tests — fast sanity checks that run on both desktop and mobile.
 * These are the first tests to run and should always pass.
 */
import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Resto|ATR/i);
});

test("authenticated user can access projects page", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
});

test("sidebar navigation links are visible on projects page", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
});
