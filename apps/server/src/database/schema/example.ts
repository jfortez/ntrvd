import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const exampleSchema = pgTable('example', {
  id: serial('id').primaryKey(),
  foo: text('foo').notNull(),
  bar: text('bar'),
});
