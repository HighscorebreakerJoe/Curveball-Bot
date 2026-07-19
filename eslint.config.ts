import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "eslint.config.ts",
        ],
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        languageOptions: {
            globals: globals.node,

            parserOptions: {
                projectService: true,
            },
        },
    },

    eslintConfigPrettier,
]);