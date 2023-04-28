module.exports = {
  env: {
    browser: true,
  },
  extends: [
    "alloy",
    "alloy/typescript",
    "plugin:solid/typescript",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  settings: {
    "import/resolver": {
      typescript: true,
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  ignorePatterns: [
    "*.vue",
    "postcss.config.js",
    "tailwind.config.js",
    "vite.config.js",
    ".eslintrc.js",
    "src-tauri/bindings/*",
  ],
  plugins: ["@typescript-eslint", "solid", "import"],
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/explicit-member-accessibility": "off",
    "import/prefer-default-export": "error",
    "import/exports-last": "error",
    "import/no-named-as-default": "off"
  },

  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "no-undef": "off"
      }
    }
  ]
};
