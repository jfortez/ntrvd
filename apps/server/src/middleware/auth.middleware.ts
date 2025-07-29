import { TRPCError } from '@trpc/server';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import {
  MiddlewareOptions,
  MiddlewareResponse,
  TRPCMiddleware,
} from 'nestjs-trpc';
import { Context } from '@/trpc/trpc.context';
import { SessionUser } from '@/user/user.schema';

@Injectable()
export class AuthMiddleware implements TRPCMiddleware {
  constructor(private readonly jwtService: JwtService) {}
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
      const payload = await this.jwtService.verifyAsync<SessionUser>(token);
      req['user'] = payload; // Attach user info to request
      return opts.next();
    } catch {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No autorizado - Token inválido',
      });
    }
  }
}
