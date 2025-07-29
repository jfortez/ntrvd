import { Inject, Injectable } from '@nestjs/common';
import { type CreateExample, type UpdateExample } from './example.schema';
import { DRIZZLE } from '@/database/database.provider';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '@/database/types';
import { exampleTable, type Example } from '@/database/schema/example';

@Injectable()
export class ExampleService {
  constructor(
    @Inject(DRIZZLE)
    private db: DrizzleDB,
  ) {}
  create(data: CreateExample) {
    return this.db.insert(exampleTable).values({
      ...data,
    });
  }

  findAll() {
    return this.db.select().from(exampleTable);
  }

  findOne(id: number) {
    return this.db.query.exampleTable.findFirst({
      where: (example) => eq(example.id, id),
    });
  }

  update(id: Example['id'], data: UpdateExample) {
    return this.db
      .update(exampleTable)
      .set(data)
      .where(eq(exampleTable.id, id));
  }

  remove(id: number) {
    return this.db.delete(exampleTable).where(eq(exampleTable.id, id));
  }
}
