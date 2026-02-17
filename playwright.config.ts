import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    // Run auth setup once to save session state
    {
      name: "auth-setup",
      testMatch: /auth\.setup\.ts/,
    },
    // Desktop Chromium — authenticated
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.clerk/user.json",
      },
      dependencies: ["auth-setup"],
      testIgnore: /auth\.setup\.ts/,
    },
    // Mobile Safari — only smoke tests to keep CI fast
    {
      name: "mobile-safari",
      use: {
        ...devices["iPhone 13"],
        storageState: "e2e/.clerk/user.json",
      },
      dependencies: ["auth-setup"],
      testIgnore: /auth\.setup\.ts/,
      testMatch: /smoke\.spec\.ts/,
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
