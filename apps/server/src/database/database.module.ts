import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DrizzleProvider, DRIZZLE } from './database.provider';

@Module({
  imports: [ConfigModule],
  providers: [...DrizzleProvider],
  exports: [DRIZZLE],
})
export class DatabaseModule {}
