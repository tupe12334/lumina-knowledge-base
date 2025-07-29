import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/setup-swagger';
import { DEFAULT_CORS } from '@lumina/services-configs';
import { env } from './env';

process.title = 'lumina-server';

/**
 * Initializes the Nest application so it can serve API requests.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  // Configure CORS with environment-specific origins
  const corsOrigins = env.CORS_ORIGIN
    ? env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : DEFAULT_CORS;

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  await app.listen(env.PORT);
}

void bootstrap();
