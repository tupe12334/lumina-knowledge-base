import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validate as uuidValidate } from 'uuid';

const uuidRegex =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

describe('seed UUID format', () => {
  it('uses valid PostgreSQL UUIDs in seed files', () => {
    const files = readdirSync(__dirname).filter(
      (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'),
    );

    for (const file of files) {
      const content = readFileSync(join(__dirname, file), 'utf8');
      const matches = content.match(uuidRegex) ?? [];

      for (const match of matches) {
        expect(uuidValidate(match), `Invalid UUID ${match} in ${file}`).toBe(
          true,
        );
      }
    }
  });
});
