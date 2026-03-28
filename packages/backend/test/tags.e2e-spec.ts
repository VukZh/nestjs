import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { startDatabase, stopDatabase, truncateDatabase } from './setup';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { DBService } from '../src/db/db.service';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';

describe('E2E Tags', () => {
  let app: INestApplication;
  let dbService: DBService;
  let adminToken: string;
  jest.setTimeout(120000);

  beforeAll(async () => {
    await startDatabase();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication() as INestApplication;
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    dbService = moduleFixture.get<DBService>(DBService);
  });

  beforeEach(async () => {
    await truncateDatabase(dbService);

    await request(app.getHttpAdapter().getInstance())
      .post('/auth/signup')
      .send({ email: 'admin@example.com', password: 'password' });

    const loginRes = await request(app.getHttpAdapter().getInstance())
      .post('/auth/signin')
      .send({ email: 'admin@example.com', password: 'password' })
      .expect(201);
    adminToken = loginRes.body.access_token;
  });
  afterAll(async () => {
    if (app) await app.close();
    await stopDatabase();
  });

  it('should perform full CRUD on tags as admin', async () => {
    const newTag = { name: 'Tag1' };

    const createRes = await request(app.getHttpAdapter().getInstance())
      .post('/tags')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newTag)
      .expect(201);

    const tagId = createRes.body.id;
    expect(tagId).toBeDefined();

    const listRes = await request(app.getHttpAdapter().getInstance())
      .get('/tags')
      .expect(200);
    expect(listRes.body.some((t: any) => t.id === tagId)).toBe(true);

    const singleRes = await request(app.getHttpAdapter().getInstance())
      .get(`/tags/${tagId}`)
      .expect(200);
    expect(singleRes.body.name).toBe(newTag.name);

    await request(app.getHttpAdapter().getInstance())
      .patch(`/tags/${tagId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'NestJS-Updated' })
      .expect(200);

    await request(app.getHttpAdapter().getInstance())
      .delete(`/tags/${tagId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);


    await request(app.getHttpAdapter().getInstance())
      .get(`/tags/${tagId}`)
      .expect(404);
  });

  it('should return 400 for invalid tag data', async () => {
    const res = await request(app.getHttpAdapter().getInstance())
      .post('/tags')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '' })
      .expect(400);

    expect(res.body.message).toContain('name should not be empty');
  });

  it('should return 403 for non-admin on protected routes', async () => {
    await request(app.getHttpAdapter().getInstance())
      .post('/auth/signup')
      .send({ email: 'user@example.com', password: 'password' });

    const loginRes = await request(app.getHttpAdapter().getInstance())
      .post('/auth/signin')
      .send({ email: 'user@example.com', password: 'password' })
      .expect(201);

    const userToken = loginRes.body.access_token;

    await request(app.getHttpAdapter().getInstance())
      .post('/tags')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Forbidden' })
      .expect(403);
    const res = await request(app.getHttpAdapter().getInstance())
      .post('/tags')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Forbidden' })
      .expect(403);
    expect(res.body.message).toBe('Only admin can create tags');
  });
});
