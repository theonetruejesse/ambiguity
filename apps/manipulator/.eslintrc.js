/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@ambiguity/eslint-config/server.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
