import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const exampleTable = pgTable('example', {
  id: serial('id').primaryKey(),
  foo: text('foo').notNull(),
  bar: integer('bar'),
});

export type Example = typeof exampleTable.$inferSelect;

export type UpdateExample = Omit<Example, 'id'>;
