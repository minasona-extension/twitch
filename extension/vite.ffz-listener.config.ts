import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        background: "src/ffz-listener.ts",
      },
      output: {
        entryFileNames: "ffz-listener.js", // Forces simple names: background.js, content.js
      },
    },
    emptyOutDir: false,
  },
});