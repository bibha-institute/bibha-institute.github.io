import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "github-pages",
  base: "/",
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../github-pages-dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "github-pages/index.html"),
        privacy: resolve(process.cwd(), "github-pages/privacy/index.html"),
      },
    },
  },
});
