// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import cypressPlugin from "eslint-plugin-cypress/flat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
    },
  },

  {
    files: ["cypress/e2e/**/*.cy.{js,ts,jsx,tsx}"],
    plugins: {
      cypress: cypressPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...cypressPlugin.configs.globals.languageOptions.globals,
      },
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,

      "no-unused-expressions": "off",

      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          "allowShortCircuit": true,
          "allowTernary": true,
          "allowTaggedTemplates": true,
          "enforceForJSX": true,
          "allowSimpleAssign": true,
          "allowTemplateLiterals": true,
          "allowVoid": true
        }
      ],
    },
  },
);