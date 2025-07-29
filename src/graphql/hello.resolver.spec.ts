import { describe, it, expect } from 'vitest';
import { HelloResolver } from './hello.resolver';

describe('HelloResolver', () => {
  it('returns hello world', () => {
    const resolver = new HelloResolver();
    expect(resolver.hello()).toBe('Hello World!');
  });
});
