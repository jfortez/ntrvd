import { Inject } from '@nestjs/common';
import { Router, Mutation, Ctx, Input } from 'nestjs-trpc';
import { AuthService } from './auth.service';
import { loginSchema } from '../user/user.schema';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { Context } from '@/trpc/trpc.context';
import { TOKEN_EXPIRATION } from '@/globals';

@Router({ alias: 'auth' })
export class AuthRouter {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Mutation({ input: loginSchema })
  async login(
    @Input() input: z.infer<typeof loginSchema>,
    @Ctx() ctx: Context,
  ) {
    try {
      const token = await this.authService.login(input);

      // Configuración segura de la cookie
      ctx.res.cookie('token', token, {
        httpOnly: true, // Previene acceso desde JavaScript del cliente
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict', // Protección contra CSRF
        maxAge: TOKEN_EXPIRATION, // 7 días en milisegundos
      });
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
