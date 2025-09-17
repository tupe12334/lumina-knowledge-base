/**
 * Create a deterministic JSON string for any JSON-like value.
 * - Object keys are sorted (ascending) for stable output.
 * - Dates are converted to ISO strings.
 * - Buffers are converted to hex strings.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);
}

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
      const arrayValue: unknown[] = value;
      return arrayValue.map((v) => normalize(v));
    }

    // At this point, value is a non-null object that's not an array or Date or Buffer
    if (isRecord(value)) {
      const sortedKeys = Object.keys(value).sort();
      const out: Record<string, unknown> = {};
      for (const k of sortedKeys) {
        // Safe property access with additional security checks
        if (Object.prototype.hasOwnProperty.call(value, k)) {
          const descriptor = Object.getOwnPropertyDescriptor(value, k);
          if (descriptor && descriptor.enumerable && typeof k === 'string') {
            out[k] = normalize(value[k]);
          }
        }
      }
      return out;
    }
    // Fallback for unknown object types
    return value;
  };

  return JSON.stringify(normalize(input));
};
