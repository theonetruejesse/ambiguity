/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@ambiguity/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};