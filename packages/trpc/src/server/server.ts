import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  example: t.router({
    getExamples: publicProcedure.output(z.array(z.object({ id: z.number(), foo: z.string(), bar: z.number() }))).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getExample: publicProcedure.input(z.number()).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    createExample: publicProcedure.mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    updateExample: publicProcedure.mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    deleteExample: publicProcedure.input(z.number()).output(z.boolean()).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  auth: t.router({
    login: publicProcedure.input(z.object({
      email: z.email('Email inválido'),
      password: z.string().min(1, 'La contraseña es requerida'),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    logout: publicProcedure.mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  }),
  user: t.router({
    register: publicProcedure.input(z.object({
      id: z.number(),
      name: z.string().min(1, 'El nombre es requerido'),
      email: z.string().email('Email inválido'),
      password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
      createdAt: z.date(),
      updatedAt: z.date(),
    }).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUser: publicProcedure.query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any),
    getUsers: publicProcedure.input(z.number()).query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

