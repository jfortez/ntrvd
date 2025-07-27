import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  example: t.router({
    getExamples: publicProcedure.query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getExample: publicProcedure.input(z.number()).output(z.object({
      id: z.string(),
      foo: z.string().min(1, 'Foo is required'),
      bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
    }).extend({ id: z.string() }).nullable()).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createExample: publicProcedure.input(z.object({
      foo: z.string().min(1, 'Foo is required'),
      bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
    })).output(z.object({
      id: z.string(),
      foo: z.string().min(1, 'Foo is required'),
      bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
    }).extend({ id: z.string() })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateExample: publicProcedure.input(z.object({
      id: z.string(),
      foo: z.string().min(1, 'Foo is required'),
      bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
    })).output(z.object({
      id: z.string(),
      foo: z.string().min(1, 'Foo is required'),
      bar: z.number().int().min(0, 'Bar must be a non-negative integer'),
    }).extend({ id: z.string() }).nullable()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteExample: publicProcedure.input(z.string()).output(z.boolean()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

