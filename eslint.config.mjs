// @ts-check
import config from 'eslint-config-agent';

// Add additional ignores for generated folders
export default [
  ...config,
  {
    ignores: [
      '**/generated/**',
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
    ],
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.spec.ts', '**/*.e2e-spec.ts', '**/*.test.ts'],
    rules: {
      'ddd/require-spec-file': 'error',
    },
  },
];