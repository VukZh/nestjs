import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    UsersModule,
    TasksModule,
    TagsModule,
    CommentsModule,
    DbModule,
    AuthModule,
    ...(isTest
      ? []
      : [
          ThrottlerModule.forRoot({
            throttlers: [
              {
                ttl: 60000,
                limit: 20,
              },
            ],
          }),
        ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...(isTest
      ? []
      : [
          {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
          },
        ]),
  ],
})
export class AppModule {}
