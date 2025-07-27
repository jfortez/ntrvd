import * as exampleSchema from './example';
import * as userSchema from './users';

export const schema = {
  ...exampleSchema,
  ...userSchema,
};

export type Schema = typeof schema;
