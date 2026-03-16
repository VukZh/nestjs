import { Global, Module } from '@nestjs/common';
import { DBService } from './db.service';

@Global()
@Module({
  providers: [DBService],
})
export class DbModule {}
