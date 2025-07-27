import { Inject, Injectable } from '@nestjs/common';
import { type CreateExample, type UpdateExample } from './example.schema';
import { DRIZZLE } from '@/database/database.provider';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '@/database/types';
import { exampleSchema } from '@/database/schema/example';

@Injectable()
export class ExampleService {
  constructor(
    @Inject(DRIZZLE)
    private db: DrizzleDB,
  ) {}
  create(data: CreateExample) {
    return this.db.insert(exampleSchema).values({
      ...data,
    });
  }

  findAll() {
    return this.db.select().from(exampleSchema);
  }

  findOne(id: number) {
    return this.db.query.exampleSchema.findFirst({
      where: (example) => eq(example.id, id),
    });
  }

  update(id: number, data: UpdateExample) {
    return this.db
      .update(exampleSchema)
      .set(data)
      .where(eq(exampleSchema.id, id));
  }

  remove(id: number) {
    return this.db.delete(exampleSchema).where(eq(exampleSchema.id, id));
  }
}
