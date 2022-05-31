module.exports = {
  extends: [
    "airbnb",
    "prettier",
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  plugins: ["prettier", "jest", "svelte3"],
  rules: {
    "prettier/prettier": "off",
    "no-unused-vars": "warn",
    "func-names": "off",
    "object-shorthand": "off",
    "class-methods-use-this": "warn",
    "no-use-before-define": "off",
    "no-restricted-syntax": "off",
    "global-require": "off",
    "react/jsx-props-no-spreading": "off",
    "react/destructuring-assignment": "off",
    "react/forbid-prop-types": "off",
    "react/no-unused-prop-types": "off",
    "dot-notation": "off",
    "no-shadow": "off",
    "import/extensions": ["error", "ignorePackages"],
    "import/prefer-default-export": "off",
    "import/no-mutable-exports": "off",
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    "jest/globals": true,
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
};
