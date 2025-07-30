import { Inject } from '@nestjs/common';
import { Router, Query, Mutation, Input, UseMiddlewares } from 'nestjs-trpc';
import { ExampleService } from './example.service';
import { z } from 'zod';
import { exampleSchema, createExampleSchema } from './example.schema';
import { LoggerMiddleware } from '@/middleware/logger.middleware';
import { AuthMiddleware } from '@/middleware/auth.middleware';

@Router({ alias: 'example' })
@UseMiddlewares(LoggerMiddleware)
export class ExampleRouter {
  constructor(
    @Inject(ExampleService) private readonly exampleService: ExampleService,
  ) {}

  @Query({
    output: z.array(z.object({ id: z.number(), foo: z.string(), bar: z.number() })),
  })
  @UseMiddlewares(AuthMiddleware)
  getExamples() {
    return this.exampleService.findAll();
  }

  @Query({
    input: z.number(),
  })
  getExample(@Input() id: number) {
    return this.exampleService.findOne(id);
  }

  @Mutation()
  createExample(@Input() data: z.infer<typeof createExampleSchema>) {
    return this.exampleService.create(data);
  }

  @Mutation()
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
