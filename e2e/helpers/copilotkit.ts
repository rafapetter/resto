import type { Page } from "@playwright/test";

/**
 * Intercepts all calls to /api/copilotkit and returns a minimal streaming SSE
 * response that CopilotKit expects. Prevents real LLM calls in E2E tests.
 */
export async function mockCopilotKit(page: Page): Promise<void> {
  await page.route("**/api/copilotkit", async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body: [
        'data: {"type":"text_delta","delta":"[mock response]"}\n\n',
        'data: {"type":"done"}\n\n',
      ].join(""),
    });
  });
}
