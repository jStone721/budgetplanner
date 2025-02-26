import {defineConfig} from "vite";
import {resolve} from "path";

export default defineConfig({
  base: "/budgetplanner/", // GitHub Pages repo name
  resolve: {
    alias: {
      crypto: "crypto-browserify",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
