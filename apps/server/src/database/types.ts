import type { Schema } from './schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzleDB = NodePgDatabase<Schema>;
