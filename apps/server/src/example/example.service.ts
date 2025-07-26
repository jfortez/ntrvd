import { Injectable } from '@nestjs/common';
import type { Example, CreateExample, UpdateExample } from './example.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ExampleService {
  private examples: Array<Example & { id: string }> = [];

  create(data: CreateExample): Promise<Example & { id: string }> {
    const newExample: Example = {
      ...data,
      id: uuid(),
    };
    this.examples.push(newExample);
    return Promise.resolve(newExample);
  }

  findAll(): Promise<Array<Example & { id: string }>> {
    return Promise.resolve(this.examples);
  }

  findOne(id: string): Promise<(Example & { id: string }) | null> {
    const example = this.examples.find((e) => e.id === id);
    return Promise.resolve(example || null);
  }

  update(
    id: string,
    data: UpdateExample,
  ): Promise<(Example & { id: string }) | null> {
    const index = this.examples.findIndex((e) => e.id === id);
    if (index === -1) return Promise.resolve(null);

    this.examples[index] = { ...data, id };
    return Promise.resolve(this.examples[index]);
  }

  remove(id: string): Promise<boolean> {
    const index = this.examples.findIndex((e) => e.id === id);
    if (index === -1) return Promise.resolve(false);

    this.examples.splice(index, 1);
    return Promise.resolve(true);
  }
}
