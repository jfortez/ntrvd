import { MiddlewareOptions, TRPCMiddleware } from 'nestjs-trpc';
import { Inject, Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements TRPCMiddleware {
  constructor(
    @Inject(ConsoleLogger) private readonly consoleLogger: ConsoleLogger,
  ) {}

  async use(opts: MiddlewareOptions) {
    const start = Date.now();
    const { next, path, type } = opts;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await next();

    const durationMs = Date.now() - start;
    const meta = { path, type, durationMs };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unsafe-member-access
    result.ok
      ? this.consoleLogger.log('OK request timing:', meta)
      : this.consoleLogger.error('Non-OK request timing', meta);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }
}
