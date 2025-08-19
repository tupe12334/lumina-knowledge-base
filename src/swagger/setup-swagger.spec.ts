import { INestApplication } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nestjs/swagger', async () => {
  const actual =
    await vi.importActual<typeof import('@nestjs/swagger')>('@nestjs/swagger');
  return {
    ...actual,
    SwaggerModule: {
      createDocument: vi.fn(() => ({}) as OpenAPIObject),
      setup: vi.fn(),
    },
  };
});

import { SwaggerModule, OpenAPIObject, DocumentBuilder } from '@nestjs/swagger';
import { setupSwagger } from './setup-swagger';
vi.mock('../openapi/save-openapi-spec', () => ({
  saveOpenapiSpec: vi.fn(),
}));
import { saveOpenapiSpec } from '../openapi/save-openapi-spec';
const saveOpenapiSpecMock = vi.mocked(saveOpenapiSpec);

describe('setupSwagger', () => {
  it('configures swagger module', () => {
    const app = { getHttpAdapter: vi.fn() } as unknown as INestApplication;
    const document = {} as unknown as OpenAPIObject;
    const createDocumentSpy = vi
      .spyOn(SwaggerModule, 'createDocument')
      .mockReturnValue(document);
    const setupSpy = vi
      .spyOn(SwaggerModule, 'setup')
      .mockImplementation(() => {});

    setupSwagger(app);

    expect(createDocumentSpy).toHaveBeenCalled();
    expect(setupSpy).toHaveBeenCalledWith('api', app, document, {
      jsonDocumentUrl: 'openapi',
    });
    expect(saveOpenapiSpecMock).toHaveBeenCalled();
  });
});
