import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  bundle: true,
  format: ["esm"],
  platform: "node",
  target: "node22",
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
