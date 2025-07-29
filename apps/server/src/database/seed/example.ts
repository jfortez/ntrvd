import 'dotenv/config';

import { eq } from 'drizzle-orm';
import { exampleTable } from '../schema/example';
import { DatabaseConnection } from '../database.provider';

const db = DatabaseConnection.getInstance(process.env.DATABASE_URL);

async function main() {
  const exampleItem: typeof exampleTable.$inferInsert = {
    foo: 'Hello',
    bar: 1,
  };

  await db.insert(exampleTable).values(exampleItem);
  console.log('New example item created!');

  const examples = await db.select().from(exampleTable);
  console.log('Getting all example items from the database: ', examples);

  await db
    .update(exampleTable)
    .set({
      foo: 'Updated Hello',
      bar: 1,
    })
    .where(eq(exampleTable.foo, exampleItem.foo));
  console.log('Example item info updated!');

  await db.delete(exampleTable).where(eq(exampleTable.foo, exampleItem.foo));
  console.log('Example item deleted!');
}

main();
