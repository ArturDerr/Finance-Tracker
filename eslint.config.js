import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: ["dist/", "build/", "node_modules/", "coverage/"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser, 
        ...globals.node,   
      },
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], 
      "no-console": ["warn", { allow: ["warn", "error"] }],    
      "prefer-const": "error",                                 
      "no-var": "error",                                        
      "eqeqeq": ["error", "always"],                        
    },
  },

  eslintConfigPrettier,
];
