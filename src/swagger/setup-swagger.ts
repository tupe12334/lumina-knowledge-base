import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { saveOpenapiSpec } from '../openapi/save-openapi-spec';
import { join } from 'path';

/**
 * Configure Swagger for API documentation.
 *
 * @param app - Nest application instance.
 */
export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Lumina API')
    .setDescription('API documentation for Lumina server')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { jsonDocumentUrl: 'openapi' });
  SwaggerModule.setup('api-json', app, document, {
    jsonDocumentUrl: 'openapi',
  });
  SwaggerModule.setup('api-docs', app, document, {
    jsonDocumentUrl: 'openapi',
  });
  void saveOpenapiSpec(document, join(process.cwd(), 'openapi.json'));
};
