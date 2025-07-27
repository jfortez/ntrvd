import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleRouter } from './example.router';
import { LoggerMiddleware } from '@/middleware/logger.middleware';
import { ConsoleLogger } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';

@Module({
  controllers: [],
  imports: [DatabaseModule],
  providers: [ExampleService, ExampleRouter, LoggerMiddleware, ConsoleLogger],
})
export class ExampleModule {}
