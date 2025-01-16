const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

// Dynamically detect all client folders
const clientsDir = path.resolve(__dirname, "clients");
const clients = fs
  .readdirSync(clientsDir)
  .filter((client) => fs.statSync(path.join(clientsDir, client)).isDirectory());

// Create entry points for all clients
const entry = {
  server: "./src/index.ts", // Main server entry point
  ...clients.reduce((entries, client) => {
    entries[`clients/${client}`] = `./clients/${client}/index.ts`;
    return entries;
  }, {}),
};

module.exports = {
  entry,
  output: {
    filename: "[name].js", // Creates dist/server.js and dist/clients/<client>.js
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "commonjs2", // Export as CommonJS for compatibility
    },
    clean: true,
  },
  target: "node", // Set target environment to Node.js
  mode: process.env.NODE_ENV || "development", // Set mode to 'development' or 'production'
  devtool: "source-map", // Generate source maps for debugging
  resolve: {
    extensions: [".ts", ".tsx", ".js"], // File extensions to resolve
    symlinks: true,
    alias: {
      "@": path.resolve(__dirname, "src"), // Support for @ path alias
    },
    fallback: {
      "pg-native": false,
    },
  },
  externals: {
    "dotenv/config": "commonjs dotenv/config", // Ensure dotenv is loaded at runtime
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
