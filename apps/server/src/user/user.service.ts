import { Inject, Injectable } from '@nestjs/common';
import { TRPCError } from '@trpc/server';
import { hashSync } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/database.provider';
import type { DrizzleDB } from '../database/types';
import { usersSchema, type NewUser } from '../database/schema/users';
import { type CreateUser } from './user.schema';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(data: CreateUser) {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.findByEmail(data.email);
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'El email ya está registrado',
        });
      }

      // Hash de la contraseña
      const hashedPassword = hashSync(data.password, 10);

      // Crear el usuario
      const newUser: NewUser = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      };

      const [user] = await this.db
        .insert(usersSchema)
        .values(newUser)
        .returning();

      // Omitir la contraseña en la respuesta
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al crear el usuario',
      });
    }
  }

  async findAll() {
    try {
      const users = await this.db.query.usersSchema.findMany({
        columns: {
          password: false,
        },
      });
      return users;
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener los usuarios',
      });
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.db.query.usersSchema.findFirst({
        where: eq(usersSchema.id, id),
        columns: {
          password: false,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }

      return user;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al obtener el usuario',
      });
    }
  }

  async findByEmail(email: string) {
    try {
      const [user] = await this.db
        .select()
        .from(usersSchema)
        .where(eq(usersSchema.email, email));

      return user;
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al buscar el usuario',
      });
    }
  }

  async update(id: number, data: Partial<CreateUser>) {
    try {
      // Si se está actualizando la contraseña, hashearla
      if (data.password) {
        data.password = hashSync(data.password, 10);
      }

      const [user] = await this.db
        .update(usersSchema)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(usersSchema.id, id))
        .returning({ id: usersSchema.id });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }
      return user;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al actualizar el usuario',
      });
    }
  }

  async remove(id: number) {
    try {
      const [user] = await this.db
        .delete(usersSchema)
        .where(eq(usersSchema.id, id))
        .returning({ id: usersSchema.id });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }

      return user;
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Error al eliminar el usuario',
      });
    }
  }
}
