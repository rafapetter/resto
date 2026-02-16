import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/crypto/**",
        "src/lib/llm/analyzer.ts",
        "src/lib/llm/router.ts",
        "src/lib/knowledge/size-enforcer.ts",
        "src/lib/chat/message-converter.ts",
        "src/lib/rate-limit.ts",
        "src/lib/utils/multi-select.ts",
      ],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
