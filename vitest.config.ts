import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
  },
  resolve: {
    alias: {
      '@prisma/client': resolve(__dirname, './generated/client'),
    },
  },
});
