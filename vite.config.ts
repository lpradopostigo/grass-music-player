import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3005,
  },
  build: {
    target: "esnext",
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
});
