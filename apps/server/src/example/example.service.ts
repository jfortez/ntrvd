import { Injectable } from '@nestjs/common';
import type { Example } from './example.schema';

@Injectable()
export class ExampleService {
  create() {
    return 'This action adds a new example';
  }

  findAll(): Promise<Example[]> {
    return new Promise<Example[]>((resolve) => {
      resolve([
        {
          foo: 'foo',
          bar: 1,
        },
        {
          foo: 'bar',
          bar: 2,
        },
      ]);
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} example`;
  }

  update(id: number) {
    return `This action updates a #${id} example`;
  }

  remove(id: number) {
    return `This action removes a #${id} example`;
  }
}
