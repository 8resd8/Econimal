import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import noRelativeImportPathsPlugin from 'eslint-plugin-no-relative-import-paths';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      tailwindcss: tailwindcssPlugin,
      'react-refresh': reactRefreshPlugin,
      'no-relative-import-paths': noRelativeImportPathsPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/classnames-order': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          format: ['UPPER_CASE'],
          modifiers: ['const', 'global'],
        },
        {
          selector: 'function',
          format: ['camelCase'],
          filter: {
            regex: '^use[A-Z]',
            match: true,
          },
        },
        {
          selector: 'function',
          format: ['camelCase'],
          filter: {
            regex: '^with[A-Z]',
            match: true,
          },
        },
        {
          selector: 'function',
          format: ['camelCase'],
          filter: {
            regex: '^handle[A-Z].*[A-Z]',
            match: true,
          },
        },
      ],
      // 화살표 함수 사용 강제
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      // 이벤트 핸들러 네이밍 규칙
      'react/jsx-handler-names': [
        'error',
        {
          eventHandlerPrefix: 'handle',
          eventHandlerPropPrefix: 'on',
        },
      ],
      'no-relative-import-paths/no-relative-import-paths': [
        'warn',
        { allowSameFolder: true, rootDir: 'src', prefix: '@' },
      ],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
      ],
    },

    settings: {
      react: { version: 'detect' },
      tailwindcss: {
        callees: ['cn', 'clsx', 'twMerge'],
        config: './tailwind.config.js',
      },
    },
  },
];
