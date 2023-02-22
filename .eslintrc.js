module.exports = {
  env: {
    browser: true,
  },
  extends: ["alloy", "alloy/typescript", "plugin:solid/typescript"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  ignorePatterns: ["postcss.config.js", "vite.config.js", ".eslintrc.js", "src-tauri/bindings/*"],
  plugins: ["@typescript-eslint", "solid"],
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
  },
};
