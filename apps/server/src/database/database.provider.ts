import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import { schema } from './schema';
import type { DrizzleDB as PgDrizzle } from './types';

export const DRIZZLE = Symbol('DRIZZLE');

export class DatabaseConnection {
  private static instance: PgDrizzle | null = null;

  private constructor() {}

  public static getInstance(url?: string) {
    if (!DatabaseConnection.instance) {
      if (!url) {
        throw new Error('DATABASE_URL is not defined in the configuration');
      }
      DatabaseConnection.instance = drizzle({
        connection: url,
        schema,
      }) as PgDrizzle;
    }
    return DatabaseConnection.instance;
  }
}

export const DrizzleProvider = [
  {
    provide: DRIZZLE,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const connectionString = configService.get<string>('DATABASE_URL');
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in the configuration');
      }

      return DatabaseConnection.getInstance(connectionString);
    },
  },
];
