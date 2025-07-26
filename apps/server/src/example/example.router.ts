import { Inject } from '@nestjs/common';
import { Router, Query, Input, UseMiddlewares } from 'nestjs-trpc';
import { ExampleService } from './example.service';
import { z } from 'zod';
import { example } from './example.schema';
import { LoggerMiddleware } from '@/middleware/logger.middleware';
// import {} from 'nestjs-trpc/types'

@Router()
export class ExampleRouter {
  constructor(
    @Inject(ExampleService) private readonly exampleService: ExampleService,
  ) {}

  @Query({ output: z.array(example) })
  @UseMiddlewares(LoggerMiddleware)
  findAll() {
    return this.exampleService.findAll();
  }

  @Query({ input: z.number(), output: example })
  findOne(@Input() id: number) {
    return this.exampleService.findOne(id);
  }
}
