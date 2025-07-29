import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TrpcModule } from './trpc/trpc.module';
import { ExampleModule } from './example/example.module';
import { DatabaseModule } from '@/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
      isGlobal: true,
    }),
    TrpcModule,
    DatabaseModule,
    ExampleModule,
    AuthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
