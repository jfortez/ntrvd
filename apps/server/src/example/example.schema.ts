import { z } from 'zod';

export const example = z.object({
  foo: z.string().min(1, 'Foo is required'),
  bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
});

export const createExampleSchema = z.object({
  foo: z.string().min(1, 'Foo is required'),
  bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
});

export const updateExampleSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
  foo: z.string().min(1, 'Foo is required'),
  bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
});

export type Example = z.infer<typeof example>;
