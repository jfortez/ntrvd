import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';

export const createDrizzle = (configService: ConfigService) => {
  const connectionString = configService.get('DATABASE_URL');

  // Cliente de drizzle
  const db = drizzle(connectionString);

  return { db };
};
