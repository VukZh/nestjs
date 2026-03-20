import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [UsersModule, TasksModule, TagsModule, CommentsModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
