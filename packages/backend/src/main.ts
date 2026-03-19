import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

const PORT = process.env.PORT || 3000;
export const isLoggingEnabled = process.env.LOG_DEBUG === 'true' || false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    bufferLogs: false
  });
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('NestJS Project API')
    .setDescription('The API description for my NestJS/React project')
    .setVersion('1.0')
    .addTag('users')
    .addTag('tasks')
    .addTag('tags')
    .addTag('comments')
    .addApiKey({ type: 'apiKey', name: 'x-user-id', in: 'header' }, 'x-user-id')
    .addApiKey({ type: 'apiKey', name: 'x-user-role', in: 'header' }, 'x-user-role')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(PORT);
  console.log(`NestJS is running on port ${PORT}`);
  console.log(`Swagger documentation is available at http://localhost:${PORT}/api`);
}
bootstrap();
