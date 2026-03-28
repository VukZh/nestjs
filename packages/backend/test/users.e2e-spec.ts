import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { startDatabase, stopDatabase, truncateDatabase } from './setup';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { DBService } from '../src/db/db.service';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';

describe('E2E Users', () => {
  let app: INestApplication;
  let dbService: DBService;
  let token: string;
  jest.setTimeout(120000);

  beforeAll(async () => {
    await startDatabase();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication() as INestApplication;
    app.useGlobalFilters(new GlobalExceptionFilter())
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
      .send({
        email: 'admin@example.com',
        password: 'password',
      });

    const loginRes = await request(app.getHttpAdapter().getInstance())
      .post('/auth/signin')
      .send({
        email: 'admin@example.com',
        password: 'password',
      });

    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    await stopDatabase();
  });

  it('should create, read, update, and delete a user', async () => {
    const newUser = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
      role: 'user',
      status: 'active',
    };

    const createRes = await request(app.getHttpAdapter().getInstance())
      .post('/users')
      .send(newUser)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    const userId = createRes.body.id;
    expect(userId).toBeDefined();

    const usersRes = await request(app.getHttpAdapter().getInstance())
      .get(`/users`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(usersRes.body.some((user: any) => user.id === userId)).toBe(true);

    const user = await request(app.getHttpAdapter().getInstance())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(user.body.email).toBe(newUser.email);

    await request(app.getHttpAdapter().getInstance())
      .patch(`/users/${userId}`)
      .send({
        name: 'Updated User',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpAdapter().getInstance())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    await request(app.getHttpAdapter().getInstance())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

  });

  it('should return 400 with invalid email', async () => {
    const invalidUser = {
      email: 'invalid-email',
      password: 'password',
      name: 'Test User',
      role: 'user',
      status: 'active',
    }
    const res = await request(app.getHttpAdapter().getInstance())
      .post('/users')
      .send(invalidUser)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    expect(res.body.message! as string).toContain('email must be an email');
  })

  it('should return 403 when getting users without admin role', async () => {

    await request(app.getHttpAdapter().getInstance())
      .post('/auth/signup')
      .send({
        email: 'test2@example.com',
        password: 'password2',
      })
      .expect(201);

    const loginRes = await request(app.getHttpAdapter().getInstance())
      .post('/auth/signin')
      .send({
        email: 'test2@example.com',
        password: 'password2',
      })
      .expect(201);

    const userToken = loginRes.body.access_token;

    const res = await request(app.getHttpAdapter().getInstance())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  })

});
