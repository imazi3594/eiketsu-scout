import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const spaRoot = fileURLToPath(new URL("./spa", import.meta.url));
const srcRoot = fileURLToPath(new URL("./src", import.meta.url));
const outDir = fileURLToPath(new URL("./docs", import.meta.url));

export default defineConfig({
  root: spaRoot,
  base: "/ek-scout/",
  publicDir: fileURLToPath(new URL("./spa/public", import.meta.url)),
  plugins: [tailwindcss(), viteReact()],
  resolve: {
    alias: { "@": srcRoot },
  },
  build: {
    outDir,
    emptyOutDir: true,
  },
});
