import 'dotenv/config';

import { eq } from 'drizzle-orm';
import { exampleSchema } from '../schema/example';
import { DatabaseConnection } from '../database.provider';

const db = DatabaseConnection.getInstance(process.env.DATABASE_URL);

async function main() {
  const exampleItem: typeof exampleSchema.$inferInsert = {
    foo: 'Hello',
    bar: 1,
  };

  await db.insert(exampleSchema).values(exampleItem);
  console.log('New example item created!');

  const examples = await db.select().from(exampleSchema);
  console.log('Getting all example items from the database: ', examples);

  await db
    .update(exampleSchema)
    .set({
      foo: 'Updated Hello',
      bar: 1,
    })
    .where(eq(exampleSchema.foo, exampleItem.foo));
  console.log('Example item info updated!');

  await db.delete(exampleSchema).where(eq(exampleSchema.foo, exampleItem.foo));
  console.log('Example item deleted!');
}

main();
