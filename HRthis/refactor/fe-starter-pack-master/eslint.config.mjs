import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
// Prettier entegrasyonu için gerekli modüller
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Keep compatibility with Next.js ESLint config
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Browser globals
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Standard configs
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  // Next.js configs via FlatCompat
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Prettier integration
  eslintConfigPrettier,
  // Prettier kurallarını ayrıca ekleyerek recommended yerine özel ayarlar kullanıyoruz
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
  },
  // Custom settings and rules
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Prettier configuration - synchronized with .prettierrc
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          trailingComma: "es5",
          tabWidth: 2,
          printWidth: 100,
          useTabs: false,
          arrowParens: "avoid",
          jsxSingleQuote: false,
          endOfLine: "lf",
          bracketSpacing: true,
          jsxBracketSameLine: false,
        },
      ],
      // React specific rules - relaxed for development
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Using TypeScript instead
      "react/jsx-uses-react": "off", // Not needed in React 17+
      "react/jsx-uses-vars": "error",
      "react/no-unescaped-entities": "warn",
      "react/jsx-key": "warn", // Allow missing keys (warn only)
      "no-empty": "warn", // Allow empty blocks
      "no-empty-pattern": "warn", // Allow empty destructuring
      "@typescript-eslint/no-unused-expressions": "warn",
      "no-constant-binary-expression": "warn",
      // TypeScript specific rules - relaxed for development
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "off", // Allow any during development
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unsafe-function-type": "off", // Allow Function type
      "@typescript-eslint/no-empty-object-type": "off", // Allow {} types
      // General JavaScript/TypeScript rules - relaxed for development
      "no-console": "off", // Allow console.log in development
      "no-debugger": "warn",
      "prefer-const": "warn",
      "no-var": "error",
      eqeqeq: ["warn", "always"],
      curly: ["error", "all"],
      "no-undef": "off", // Disable for mixed Node/Browser environments
      // Import/Export rules
      "import/no-duplicates": "off", // Can conflict with prettier
      "no-duplicate-imports": "warn", // Warn instead of error
      "@typescript-eslint/no-require-imports": "off", // Allow require() for Node.js files
      // Stylistic rules that work well with Prettier
      "object-shorthand": "error",
      "prefer-template": "error",
      "prefer-arrow-callback": "error",
    },
  },
];

export default eslintConfig;
