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
    const env = loadEnv({} as NodeJS.ProcessEnv);
    expect(env.PORT).toBe(3000);
    expect(env.ENABLE_MUTATIONS).toBe(false);
    expect(env.CORS_ORIGIN).toBeUndefined();
  });

  it('throws on invalid PORT value', () => {
    expect(() => loadEnv({ PORT: '0' } as NodeJS.ProcessEnv)).toThrowError();
    expect(() =>
      loadEnv({ PORT: '70000' } as NodeJS.ProcessEnv),
    ).toThrowError();
  });
  it('parses CORS_ORIGIN with zod into string[] when set', () => {
    const env = loadEnv({
      CORS_ORIGIN: 'http://a.com, http://b.com,https://c.com ',
    } as NodeJS.ProcessEnv);
    expect(env.CORS_ORIGIN).toEqual([
      'http://a.com',
      'http://b.com',
      'https://c.com',
    ]);
  });
});
