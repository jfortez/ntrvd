import { Module } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleRouter } from './example.router';
import { LoggerMiddleware } from '@/middleware/logger.middleware';

@Module({
  controllers: [],
  providers: [ExampleService, ExampleRouter, LoggerMiddleware],
})
export class ExampleModule {}
