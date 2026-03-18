import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { GlobalExceptionFilter } from './filters/global-exception.filter';


dotenv.config();

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
    bufferLogs: false
  });
  
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors();
  
  await app.listen(PORT);
  console.log(`NestJS is running on port ${PORT}`);
}
bootstrap();
