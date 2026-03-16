import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { DBService } from '../db/db.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, DBService],
})
export class TagsModule {}
