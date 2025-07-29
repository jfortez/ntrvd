import { Injectable } from '@nestjs/common';
import { TRPCContext } from 'nestjs-trpc';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export type Context = CreateExpressContextOptions;

@Injectable()
export class TrpcContext implements TRPCContext {
  constructor() {}

  create(opts: CreateExpressContextOptions): Record<string, unknown> {
    return {
      req: opts.req,
      res: opts.res,
    };
  }
}
