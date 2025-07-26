import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  example: t.router({
    getExamples: publicProcedure.output(z.array(z.object({
      foo: z.string().min(1, 'Foo is required'),
      bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
    }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getExample: publicProcedure.input(z.number()).output(z.object({
      foo: z.string().min(1, 'Foo is required'),
      bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
    })).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

