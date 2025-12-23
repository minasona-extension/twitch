import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        background: "src/ffz-content.ts",
      },
      output: {
        entryFileNames: "ffz-content.js", // Forces simple names: background.js, content.js
      },
    },
    emptyOutDir: false,
  },
});