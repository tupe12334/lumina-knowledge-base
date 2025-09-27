import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/setup-swagger';
import { env } from './env';

process.title = 'Lumina Knowledge-base';

/**
 * Initializes the Nest application so it can serve API requests.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  // Configure CORS - only enable if CORS_ORIGIN is set in environment
  if (env.CORS_ORIGIN) {
    app.enableCors({
      origin: env.CORS_ORIGIN,
      credentials: env.CORS_CREDENTIALS,
      methods: env.CORS_METHODS,
      allowedHeaders: env.CORS_ALLOWED_HEADERS,
    });
  }

  await app.listen(env.PORT, '0.0.0.0');
}

void bootstrap();
