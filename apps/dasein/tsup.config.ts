import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts", "src/{commands,events}/**/*.{ts,js}"],
  clean: true,
  format: ["esm"],
  dts: true,
  sourcemap: true,
  outDir: "dist",
  banner: {
    js: `import "reflect-metadata"; import "dotenv/config";`,
  },
  minify: false, // Optional: Disable minification for debugging
  external: ["@discordx/importer"], // Ensure the dynamic import library isn't bundled
  // esbuildOptions(options) {
  //   // Ensure all .ts and .js files are included in the build
  //   options.loader = {
  //     ...options.loader,
  //     ".ts": "ts",
  //     ".js": "js",
  //   };
  // },
});
