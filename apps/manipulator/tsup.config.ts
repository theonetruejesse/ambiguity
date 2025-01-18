import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: [
    "src/index.ts",
    "src/clients/next/index.ts",
    "src/clients/vanilla/index.ts",
  ],
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  external: ["react"],
  ...options,
}));
