import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PrismaClient } from '../generated/prisma/client';
import { execSync } from 'node:child_process';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';

let container: StartedPostgreSqlContainer;
let prisma: PrismaClient;

export async function startDatabase() {
  process.env.NODE_ENV = 'test';
  container = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();

  const dbUrl = container.getConnectionUri();
  process.env.DATABASE_URL = dbUrl;

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: dbUrl },
  });

  const pool = new pg.Pool({
    connectionString: dbUrl,
  });
  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter,
  });
  await prisma.$connect();
  return {
    container,
    dbUrl,
    prisma,
  };
}

export async function stopDatabase() {
  if (prisma) await prisma.$disconnect();
  if (container) await container.stop();
}

export async function truncateDatabase(prisma: PrismaClient) {
  const tablenames = await prisma.$queryRawUnsafe<Array<{ tablename: string }>>(
    `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename != '_prisma_migrations'`,
  );
  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
        );
      } catch (error) {
        console.error(`Error truncating table ${tablename}:`, error);
      }
    }
  }
}
