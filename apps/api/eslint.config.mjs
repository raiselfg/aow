import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    // Глобальные игноры должны быть в отдельном объекте первым элементом
    ignores: ['dist', 'node_modules', '.hono', 'coverage', 'tsup.config.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest', // Или 2024
      globals: {
        ...globals.node,
        ...globals.serviceworker,
      },
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': ['error', { type: 'natural' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
    },
  },
  prettier,
);
