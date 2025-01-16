const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.ts", // Entry point of your application
  output: {
    filename: "bundle.js", // Output file name
    path: path.resolve(__dirname, "dist"), // Output directory
    clean: true, // Clean the output directory before building
  },
  target: "node", // Set target environment to Node.js
  mode: process.env.NODE_ENV || "development", // Set mode to 'development' or 'production'
  devtool: "source-map", // Generate source maps for debugging
  resolve: {
    extensions: [".ts", ".tsx", ".js"], // File extensions to resolve
    alias: {
      "@": path.resolve(__dirname, "src"), // Support for @ path alias
    },
    fallback: {
      "pg-native": false,
    },
  },
  externals: {
    "dotenv/config": "commonjs dotenv/config", // Ensure dotenv is loaded at runtime
    fastify: "commonjs fastify", // Mark Fastify as external
    "@trpc/server/adapters/fetch": "commonjs @trpc/server/adapters/fetch", // Externalize tRPC fetch adapter
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match TypeScript and TSX files
        use: "ts-loader", // Use ts-loader for TypeScript
        exclude: /node_modules/, // Exclude node_modules
      },
    ],
  },
  plugins: [
    // Enable source-map support for Node.js
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
    // Inject environment variables into the build
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
    }),
  ],
  optimization: {
    nodeEnv: false, // Prevent Webpack from overriding process.env.NODE_ENV
  },
};
