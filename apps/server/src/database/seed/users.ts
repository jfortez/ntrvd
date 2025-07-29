import { NewUser, usersTable } from '../schema/users';
import { DatabaseConnection } from '../database.provider';
import { hash } from 'bcrypt';

const db = DatabaseConnection.getInstance(process.env.DATABASE_URL);

const users: Omit<NewUser, 'password'>[] = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
  },
  {
    name: 'Test User',
    email: 'test@example.com',
  },
];

export async function seedUsers() {
  console.log('🌱 Seeding users...');

  try {
    const hashedPassword = await hash('password123', 10);

    for (const user of users) {
      await db
        .insert(usersTable)
        .values({
          ...user,
          password: hashedPassword,
        })
        .onConflictDoNothing({ target: usersTable.email });
    }

    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

seedUsers();
