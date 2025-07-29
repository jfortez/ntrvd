import { Inject } from '@nestjs/common';
import { Router, Query, Input, Mutation } from 'nestjs-trpc';
import { UserService } from './user.service';
import { createUserSchema } from './user.schema';
import { TRPCError } from '@trpc/server';
import { UseMiddlewares } from 'nestjs-trpc';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { z } from 'zod';

@Router({ alias: 'user' })
export class UserRouter {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Mutation({ input: createUserSchema })
  async register(@Input() data: z.infer<typeof createUserSchema>) {
    try {
      const user = await this.userService.create(data);
      return user;
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: (error as Error).message,
      });
    }
  }

  @Query()
  @UseMiddlewares(AuthMiddleware)
  async getUser() {
    return this.userService.findAll();
  }

  @Query({ input: z.number() })
  @UseMiddlewares(AuthMiddleware)
  async getUsers(@Input() id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Usuario no encontrado',
      });
    }
    return user;
  }
}
