import { TRPCError } from '@trpc/server';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MiddlewareOptions,
  MiddlewareResponse,
  TRPCMiddleware,
} from 'nestjs-trpc';
import { Context } from '@/trpc/trpc.context';
import { JwtPayload } from '@/auth/auth.service';
import { UserService } from '@/user/user.service';
import { SessionUser } from '@/user/user.schema';

@Injectable()
export class AuthMiddleware implements TRPCMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(
    opts: MiddlewareOptions<Context>,
  ): Promise<MiddlewareResponse | Promise<MiddlewareResponse>> {
    const { req } = opts.ctx;

    const token = req.cookies['token'] as string;
    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No autorizado - Token no proporcionado',
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No autorizado - Usuario no encontrado',
        });
      }

      const sessionUser: SessionUser = {
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        updatedAt: user.updatedAt,
        name: user.name,
      };

      req['user'] = sessionUser; // Attach user info to request
      return opts.next({
        ctx: {
          user: sessionUser,
        },
      });
    } catch {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No autorizado - Token inválido',
      });
    }
  }
}
