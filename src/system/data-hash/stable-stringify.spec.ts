import { describe, it, expect } from 'vitest';
import { stableStringify } from 'src/system/data-hash/stable-stringify';

describe('stableStringify', () => {
  it('sorts object keys deterministically', () => {
    const a = { b: 1, a: 2 };
    const b = { a: 2, b: 1 };
    expect(stableStringify(a)).toEqual(stableStringify(b));
  });

  it('normalizes dates to ISO', () => {
    const d = new Date('2020-01-01T00:00:00.000Z');
    expect(stableStringify({ d })).toContain('2020-01-01T00:00:00.000Z');
  });

  it('handles arrays and nested objects', () => {
    const v1 = [{ z: 1, a: { y: 2 } }, { x: 3 }];
    const v2 = [{ a: { y: 2 }, z: 1 }, { x: 3 }];
    expect(stableStringify(v1)).toEqual(stableStringify(v2));
  });
});
