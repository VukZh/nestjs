import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { startDatabase, stopDatabase } from './setup';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('E2E Tests', () => {
  let app: INestApplication;
  jest.setTimeout(120000);

  beforeAll(async () => {
    await startDatabase();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();
    app = moduleFixture.createNestApplication() as INestApplication;
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    await stopDatabase();
  });
  it('/ (GET)', () => {
    return request(app.getHttpAdapter().getInstance())
      .get('/')
      .expect(200)
      .expect(JSON.stringify({message: 'Hello World!'}));
  });
});
