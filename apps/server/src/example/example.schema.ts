import { z } from 'zod';

export const exampleSchema = z.object({
  id: z.number(),
  foo: z.string().min(1, 'Foo is required'),
  bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
});

export const createExampleSchema = z.object({
  foo: z.string().min(1, 'Foo is required'),
  bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
});

export const updateExampleSchema = z.object({
  foo: z.string().min(1, 'Foo is required'),
  bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
});

export type Example = z.infer<typeof exampleSchema>;
export type CreateExample = z.infer<typeof createExampleSchema>;
export type UpdateExample = z.infer<typeof updateExampleSchema>;
