import 'reflect-metadata';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { startDatabase, stopDatabase, truncateDatabase } from './setup';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { DBService } from '../src/db/db.service';
import { GlobalExceptionFilter } from '../src/filters/global-exception.filter';

describe('E2E Tasks', () => {
  let app: INestApplication;
  let dbService: DBService;
  let adminToken: string;
  let adminId: number;
  let tagId: number;
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
      .send({
        email: 'admin@example.com',
        password: 'password',
      });

    const loginRes = await request(app.getHttpAdapter().getInstance())
      .post('/auth/signin')
      .send({
        email: 'admin@example.com',
        password: 'password',
      })
      .expect(201);

    adminToken = loginRes.body.access_token;
    adminId = loginRes.body.user.id;

    const tag = await dbService.tag.create({
      data: { name: 'E2E-Test-Tag' },
    });
    tagId = tag.id;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    await stopDatabase();
  });

  it('should perform full CRUD on tasks with tags and nested comments', async () => {
    const newTask = {
      title: 'E2E Task Title',
      content: 'Detailed description of the task',
      status: 'draft',
      tagIds: [tagId],
      comment: 'First comment',
    };

    const createRes = await request(app.getHttpAdapter().getInstance())
      .post('/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newTask)
      .expect(201);

    const taskId = createRes.body.id;
    expect(taskId).toBeDefined();
    expect(createRes.body.tags).toHaveLength(1);
    expect(createRes.body.tags[0].name).toBe('E2E-Test-Tag');
    expect(createRes.body.comments).toHaveLength(1);
    expect(createRes.body.comments[0].content).toBe('First comment');

    const listRes = await request(app.getHttpAdapter().getInstance())
      .get('/tasks')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.some((t: any) => t.id === taskId)).toBe(true);

    const singleRes = await request(app.getHttpAdapter().getInstance())
      .get(`/tasks/${taskId}`)
      .expect(200);

    expect(singleRes.body.title).toBe(newTask.title);
    expect(singleRes.body.author.id).toBe(adminId);

    await request(app.getHttpAdapter().getInstance())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated Task Title',
        comment: 'Second comment',
      })
      .expect(200);

    const afterUpdate = await request(app.getHttpAdapter().getInstance())
      .get(`/tasks/${taskId}`)
      .expect(200);
    expect(afterUpdate.body.title).toBe('Updated Task Title');
    expect(afterUpdate.body.comments).toHaveLength(2);
    expect(afterUpdate.body.comments[1].content).toBe('Second comment');

    await request(app.getHttpAdapter().getInstance())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app.getHttpAdapter().getInstance())
      .get(`/tasks/${taskId}`)
      .expect(404);
  });

  it('should return 400 for invalid task status', async () => {
    const invalidTask = {
      title: 'Invalid Task',
      content: '...',
      status: 'invalid-status',
    };

    const res = await request(app.getHttpAdapter().getInstance())
      .post('/tasks')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(invalidTask)
      .expect(400);
    expect(JSON.stringify(res.body.message)).toContain(
      'status must be one of the following values:',
    );
  });

  it('should return 403 when user tries to delete admin task', async () => {
    const task = await dbService.task.create({
      data: {
        title: 'Admin Secret Task',
        content: 'No one should delete this',
        status: 'published',
        authorId: adminId,
      },
    });

    await request(app.getHttpAdapter().getInstance())
      .post('/auth/signup')
      .send({
        email: 'user@example.com',
        password: 'password',
      });

    const loginRes = await request(app.getHttpAdapter().getInstance())
      .post('/auth/signin')
      .send({
        email: 'user@example.com',
        password: 'password',
      })
      .expect(201);

    const userToken = loginRes.body.access_token;

    await request(app.getHttpAdapter().getInstance())
      .delete(`/tasks/${task.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});
