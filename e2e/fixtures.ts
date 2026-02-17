import { test as base, expect, type Page } from "@playwright/test";
import { mockCopilotKit } from "./helpers/copilotkit";
import {
  createTestProject,
  deleteTestProject,
  getTenantId,
  type TestProject,
} from "./helpers/db";

type Fixtures = {
  /** A page with /api/copilotkit mocked — no real LLM calls */
  mockedPage: Page;
  /** A pre-created test project, deleted after each test */
  testProject: TestProject;
};

export const test = base.extend<Fixtures>({
  mockedPage: async ({ page }, use) => {
    await mockCopilotKit(page);
    await use(page);
  },

  testProject: async ({}, use) => {
    const tenantId = await getTenantId();
    const project = await createTestProject(tenantId, `E2E Project ${Date.now()}`);
    await use(project);
    await deleteTestProject(project.id);
  },
});

export { expect };
