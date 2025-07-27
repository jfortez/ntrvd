import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const exampleSchema = pgTable('example', {
  id: serial('id').primaryKey(),
  foo: text('foo').notNull(),
  bar: integer('bar'),
});
