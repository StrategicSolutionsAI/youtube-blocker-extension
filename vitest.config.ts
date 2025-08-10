import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["./vitest.setup.ts"],
    environmentMatchGlobs: [
      ["src/**/*.test.tsx", "jsdom"],
    ],
  },
  resolve: {
    alias: {
      "@": "/Users/dalitbarrett/youtubeblock/src",
    },
  },
});
