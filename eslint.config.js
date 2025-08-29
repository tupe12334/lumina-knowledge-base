// @ts-check
import config from '@tupe12334/eslint-config';

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
];