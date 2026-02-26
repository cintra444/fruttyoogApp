const js = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const reactPlugin = require("eslint-plugin-react");

module.exports = [
  {
    ignores: ["node_modules/**", "android/**", ".expo/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
        __dirname: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-redeclare": "off",
      "no-case-declarations": "off",
      "no-empty": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
