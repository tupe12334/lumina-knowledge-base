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
  // Configure CORS - always enable with production and development origins
  const allowedOrigins = env.CORS_ORIGIN || [
    'https://app.lumina.study',
    'https://lumina.study',
    'https://www.lumina.study',
    'http://localhost:3000', // Knowledge base admin
    'http://localhost:3001', // Knowledge base admin fallback
    'http://localhost:5173', // Development
    'http://localhost:5174', // Development fallback
    'http://localhost:5175', // Development fallback
    'http://192.168.1.21:5173', // LAN access
    'http://192.168.1.21:5174', // LAN access fallback
    'http://192.168.1.21:5175', // LAN access fallback
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  await app.listen(env.PORT, '0.0.0.0');
}

void bootstrap();
