import { Inject } from '@nestjs/common';
import { Router, Query, Input, UseMiddlewares } from 'nestjs-trpc';
import { ExampleService } from './example.service';
import { z } from 'zod';
import { example } from './example.schema';
import { LoggerMiddleware } from '@/middleware/logger.middleware';

@Router({ alias: 'example' })
export class ExampleRouter {
  constructor(
    @Inject(ExampleService) private readonly exampleService: ExampleService,
  ) {}

  @Query({ output: z.array(example) })
  @UseMiddlewares(LoggerMiddleware)
  getExamples() {
    return this.exampleService.findAll();
  }

  @Query({ input: z.number(), output: example })
  getExample(@Input() id: number) {
    return this.exampleService.findOne(id);
  }
}
