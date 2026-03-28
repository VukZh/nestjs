import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',

      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-empty': 'warn',
      'no-extra-semi': 'warn',
      'no-unreachable': 'warn',
      'no-undef': 'warn',
      'prefer-const': 'off',
      'no-var': 'off',
      eqeqeq: 'off',
      curly: 'off',
      'no-prototype-builtins': 'off',
      'no-useless-escape': 'warn',
      'no-constant-condition': 'warn',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
];
