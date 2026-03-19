import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';


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
  
  await app.listen(PORT);
  console.log(`NestJS is running on port ${PORT}`);
}
bootstrap();
