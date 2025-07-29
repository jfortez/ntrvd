import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { exampleTable } from '@/database/schema/example';
import { z } from 'zod/v4';

const schema = {
  bar: z.number('Bar must be a number'),
  foo: z.string('Foo must be a string').min(1, 'Foo is required'),
};

export const exampleSchema = createSelectSchema(exampleTable, schema);

export const createExampleSchema = createInsertSchema(exampleTable, schema);
export const updateExampleSchema = createUpdateSchema(exampleTable, schema);

export type Example = z.infer<typeof exampleTable>;
export type CreateExample = z.infer<typeof createExampleSchema>;
export type UpdateExample = z.infer<typeof updateExampleSchema>;
