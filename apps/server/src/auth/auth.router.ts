import { Inject } from '@nestjs/common';
import { Router, Mutation, Ctx, Input } from 'nestjs-trpc';
import { AuthService } from './auth.service';
import { loginSchema } from '../user/user.schema';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { Context } from '@/trpc/trpc.context';

@Router({ alias: 'auth' })
export class AuthRouter {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Mutation({ input: loginSchema })
  async login(
    @Input() input: z.infer<typeof loginSchema>,
    @Ctx() ctx: Context,
  ) {
    try {
      const user = await this.authService.login(input, ctx.res);
      return user;
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: (error as Error).message,
      });
    }
  }

  @Mutation()
  logout(@Ctx() ctx: Context) {
    return this.authService.logout(ctx.res);
  }
}
