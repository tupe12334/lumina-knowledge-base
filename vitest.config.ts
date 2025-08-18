import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    sequence: {
      // Run test files sequentially to avoid global mutable state races (e.g., env toggling)
      concurrent: false,
    },
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      all: false,
      exclude: [
        'generated/**',
        'src/**/generated/**',
        'src/main.ts',
        'src/app.module.ts',
        'src/swagger/**',
        '**/*.spec.ts',
      ],
      thresholds: {
        branches: 50,
        functions: 25,
        lines: 55,
        statements: 55,
      },
    },
  },
  resolve: {
    alias: {
      '@prisma/client': resolve(__dirname, './generated/client'),
    },
  },
});
