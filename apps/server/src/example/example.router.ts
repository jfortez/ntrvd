import { Inject } from '@nestjs/common';
import { Router, Query, Mutation, Input, UseMiddlewares } from 'nestjs-trpc';
import { ExampleService } from './example.service';
import { z } from 'zod';
import { exampleSchema, createExampleSchema } from './example.schema';
import { LoggerMiddleware } from '@/middleware/logger.middleware';

@Router({ alias: 'example' })
export class ExampleRouter {
  constructor(
    @Inject(ExampleService) private readonly exampleService: ExampleService,
  ) {}

  @Query()
  @UseMiddlewares(LoggerMiddleware)
  getExamples() {
    return this.exampleService.findAll();
  }

  @Query({
    input: z.number(),
    output: exampleSchema.extend({ id: z.string() }).nullable(),
  })
  getExample(@Input() id: number) {
    return this.exampleService.findOne(id);
  }

  @Mutation({
    input: createExampleSchema,
    output: exampleSchema.extend({ id: z.string() }),
  })
  createExample(@Input() data: z.infer<typeof createExampleSchema>) {
    return this.exampleService.create(data);
  }

  @Mutation({
    input: exampleSchema,
    output: exampleSchema.extend({ id: z.string() }).nullable(),
  })
  updateExample(@Input() data: z.infer<typeof exampleSchema>) {
    const { id, ...updateData } = data;
    return this.exampleService.update(id, updateData);
  }

  @Mutation({
    input: z.number(),
    output: z.boolean(),
  })
  deleteExample(@Input() id: number) {
    return this.exampleService.remove(id);
  }
}
