// @ts-check
const { defineConfig } = require("eslint/config");
const rootConfig = require("../../eslint.config.js");

module.exports = defineConfig([
  ...rootConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "lux",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "lux",
          style: "camelCase",
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "off",
        {
          accessibility: "explicit",
        },
      ],
      "arrow-parens": ["off", "always"],
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  },
]);
