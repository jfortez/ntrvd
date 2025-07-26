import { Module } from '@nestjs/common';

import { TrpcModule } from './trpc/trpc.module';
import { ExampleModule } from './example/example.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TrpcModule, ExampleModule, DatabaseModule, AuthModule, UserModule],
  providers: [],
})
export class AppModule {}
