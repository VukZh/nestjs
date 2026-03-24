import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

dotenv.config();

const PORT = process.env.PORT || 3000;
export const isLoggingEnabled = process.env.LOG_DEBUG === 'true' || false;
const FE_URL = process.env.FE_URL || 'http://localhost:5173';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    bufferLogs: false,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: FE_URL,
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,
  });
  app.use(
    helmet({
      xFrameOptions: { action: 'sameorigin' },
      xXssProtection: true,
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", "'unsafe-inline'"],
        },
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Project API')
    .setDescription('The API description for my NestJS/React project')
    .setVersion('1.0')
    .addTag('users')
    .addTag('tasks')
    .addTag('tags')
    .addTag('comments')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.log(`NestJS is running on port ${PORT}`);
  console.log(
    `Swagger documentation is available at http://localhost:${PORT}/api`,
  );
}
bootstrap();
