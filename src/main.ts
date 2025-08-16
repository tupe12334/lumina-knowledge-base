import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/setup-swagger';
import { env } from './env';

process.title = 'lumina-server';

/**
 * Initializes the Nest application so it can serve API requests.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  // Configure CORS only if CORS_ORIGIN is provided via env
  if (env.CORS_ORIGIN) {
    app.enableCors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
  }

  await app.listen(env.PORT);
}

void bootstrap();
