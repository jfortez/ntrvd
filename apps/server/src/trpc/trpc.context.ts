import { Injectable } from '@nestjs/common';
import { TRPCContext } from 'nestjs-trpc';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { Request, Response } from 'express';
import { SessionUser } from '@/user/user.schema';

export type Context = {
  req: Request;
  res: Response;
  user?: SessionUser | undefined;
};

@Injectable()
export class TrpcContext implements TRPCContext {
  constructor() {}

  create(opts: CreateExpressContextOptions): Context {
    return {
      req: opts.req,
      res: opts.res,
      user: opts.req.user,
    };
  }
}
