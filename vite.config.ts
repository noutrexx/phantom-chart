import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Project page lives at https://noutrexx.github.io/phantom-chart/
// so production assets need that base path; dev stays at root.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/phantom-chart/" : "/",
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
}));
