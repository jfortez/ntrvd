import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRouter } from './user.router';
import { DatabaseModule } from '@/database/database.module';
import { AuthMiddleware } from '@/middleware/auth.middleware';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [UserService, UserRouter, AuthMiddleware],
  exports: [UserService],
})
export class UserModule {}
