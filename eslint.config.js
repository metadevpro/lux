// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/prefer-standalone": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "",
          style: "camelCase",
        },
      ],
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-member-accessibility": [
        "off",
        {
          accessibility: "explicit",
        },
      ],
      "@typescript-eslint/no-inferrable-types": "off",
      "brace-style": ["off", "off"],
      "max-len": [
        "error",
        {
          ignorePattern: "^import |^export | implements",
          code: 180,
        },
      ],
      "no-underscore-dangle": "off",
      "object-shorthand": "off",
      "quote-props": ["error", "consistent"],
      quotes: ["error", "single"],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "enum", format: ["PascalCase"] },
      ],
      "@typescript-eslint/member-ordering": "off",
      "arrow-parens": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [angular.configs.templateRecommended],
    rules: {},
  }
);
