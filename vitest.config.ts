import { defineProject } from 'vitest/config';
import { resolve } from 'path';

export default defineProject({
  test: {
    name: 'knowledge-base',
    environment: 'node',
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    sequence: {
      // Run test files sequentially to avoid global mutable state races (e.g., env toggling)
      concurrent: false,
    },
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
  },
});
