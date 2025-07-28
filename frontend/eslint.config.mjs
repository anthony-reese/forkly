// eslint.config.mjs
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cypressPlugin from "eslint-plugin-cypress/flat";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default tseslint.config(
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      globals: globals.browser,
    },
  },

  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
    rules: pluginJs.configs.recommended.rules,
  },

  {
    files: ["cypress/**/*.ts", "cypress/**/*.js"],
    plugins: {
      cypress: cypressPlugin,
    },
    languageOptions: {
      globals: globals.browser,
       ...globals.node,
       'Cypress': true,
       'cy': true,
       'expect': true,
       'assert': true,
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  ...compat.extends("next/core-web-vitals", "next")
);
