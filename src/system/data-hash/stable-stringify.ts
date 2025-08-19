/**
 * Create a deterministic JSON string for any JSON-like value.
 * - Object keys are sorted (ascending) for stable output.
 * - Dates are converted to ISO strings.
 * - Buffers are converted to hex strings.
 */
export const stableStringify = (input: unknown): string => {
  const seen = new WeakSet<object>();

  const normalize = (value: unknown): unknown => {
    if (value === null || typeof value !== 'object') {
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    }

    if (value instanceof Date) {
      return value.toISOString();
    }

    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
      return value.toString('hex');
    }

    // value is non-null object at this point
    if (seen.has(value)) {
      // Represent circular refs in a deterministic way
      return '[Circular]';
    }

    seen.add(value);

    if (Array.isArray(value)) {
      return (value as unknown[]).map((v) => normalize(v));
    }

    const obj = value as Record<string, unknown>;
    const sortedKeys = Object.keys(obj).sort();
    const out: Record<string, unknown> = {};
    for (const k of sortedKeys) {
      out[k] = normalize(obj[k]);
    }
    return out;
  };

  return JSON.stringify(normalize(input));
};
