import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, ".clerk/user.json");

setup.describe.configure({ mode: "serial" });

// Step 1: Obtain a Clerk testing token (calls Clerk Backend API once per run)
setup("obtain clerk testing token", async () => {
  await clerkSetup();
});

// Step 2: Sign in as the E2E test user and persist session state
setup("sign in and save auth state", async ({ page }) => {
  // Ensure the .clerk directory exists
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  await page.goto("/");

  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_CLERK_USER_EMAIL!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  });

  // After sign-in, Clerk redirects — confirm we can access the protected dashboard
  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible({
    timeout: 15_000,
  });

  // Persist cookies + localStorage so all other test files reuse this session
  await page.context().storageState({ path: authFile });
});
