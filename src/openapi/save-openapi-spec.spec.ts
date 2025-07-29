import { describe, it, expect, vi, afterEach } from 'vitest';
import { OpenAPIObject } from '@nestjs/swagger';
import { saveOpenapiSpec } from './save-openapi-spec';

vi.mock('fs/promises', () => ({
  writeFile: vi.fn(),
}));

import { writeFile } from 'fs/promises';

describe('saveOpenapiSpec', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('writes the document to the given path', async () => {
    const document = {} as OpenAPIObject;
    const path = 'openapi.json';

    await saveOpenapiSpec(document, path);

    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining(path),
      JSON.stringify(document, null, 2),
      { encoding: 'utf8' },
    );
  });

  it('returns early when no parameters are provided', async () => {
    await saveOpenapiSpec(undefined, undefined);
    expect(writeFile).not.toHaveBeenCalled();
  });
});
