module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:solid/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
  },
  ignorePatterns: [
    "rollup.config.main.js",
    "rollup.config.preload.js",
    "tailwind.config.js",
    "postcss.config.js",
    "vite.config.js",
    ".eslintrc.js",
  ],
  plugins: ["import", "@typescript-eslint", "solid"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "arrow-body-style": ["error", "as-needed"],
    "no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],

    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    "import/no-commonjs": [
      "error",
      {
        allowPrimitiveModules: false,
        allowRequire: false,
        allowConditionalRequire: false,
      },
    ],
    "import/prefer-default-export": ["error"],
  },
};
