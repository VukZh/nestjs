import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DBService extends PrismaClient {
  constructor() {
    const DB_URL = process.env.DATABASE_URL;
    console.log('DB_URL: ', DB_URL);
    const adapter = new PrismaPg({
      connectionString: DB_URL,
    });
    super({ adapter });
  }
}
