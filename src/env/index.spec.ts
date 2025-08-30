import { describe, expect, it } from 'vitest';
import { loadEnv } from 'src/env';

describe('env/loadEnv', () => {
  it('provides defaults and coercions (happy path)', () => {
    const fakeEnv: NodeJS.ProcessEnv = {
      PORT: '8080',
      ENABLE_MUTATIONS: 'true',
      NODE_ENV: 'test',
    };
    const env = loadEnv(fakeEnv);
    expect(env.PORT).toBe(8080);
    expect(env.ENABLE_MUTATIONS).toBe(true);
    expect(env.NODE_ENV).toBe('test');
  });

  it('applies default PORT and ENABLE_MUTATIONS when missing', () => {
    const emptyEnv: NodeJS.ProcessEnv = {};
    const env = loadEnv(emptyEnv);
    expect(env.PORT).toBe(3000);
    expect(env.ENABLE_MUTATIONS).toBe(false);
    expect(env.CORS_ORIGIN).toBeUndefined();
  });

  it('throws on invalid PORT value', () => {
    const invalidPortEnv: NodeJS.ProcessEnv = { PORT: '0' };
    expect(() => loadEnv(invalidPortEnv)).toThrowError();
    expect(() =>
      loadEnv({ PORT: '70000' } satisfies Partial<NodeJS.ProcessEnv>),
    ).toThrowError();
  });
  it('parses CORS_ORIGIN with zod into string[] when set', () => {
    const corsEnv: NodeJS.ProcessEnv = {
      CORS_ORIGIN: 'http://a.com, http://b.com,https://c.com ',
    };
    const env = loadEnv(corsEnv);
    expect(env.CORS_ORIGIN).toEqual([
      'http://a.com',
      'http://b.com',
      'https://c.com',
    ]);
  });
});
