import { describe, expect, it } from 'vitest';
import { loadEnv } from '@lumina/env-config';
import { serverEnvSchema } from './schema';

describe('server env schema', () => {
  it('parses environment variables', () => {
    const result = loadEnv(serverEnvSchema, {
      DATABASE_URL: 'https://example.com',
      PORT: '1234',
    });

    expect(result.PORT).toBe(1234);
  });
});
