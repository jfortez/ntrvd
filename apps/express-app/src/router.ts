import { publicProcedure, router } from "./trpc";
import { z } from "zod";

type User = {
  id: string;
  name: string;
  email: string;
};

const _users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
  { id: "3", name: "Charlie", email: "charlie@example.com" },
];

export const appRouter = router({
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    return _users;
  }),
  // userById: publicProcedure.input(z.string()).query(async (opts) => {
  //   const { input } = opts;
  //   const user = _users.find((user) => user.id === input);
  //   if (!user) {
  //     throw new Error("User not found");
  //   }
  //   return user;
  // }),

  // userCreate: publicProcedure
  //   .input(z.object({ name: z.string(), email: z.email() }))
  //   .mutation(async (opts) => {
  //     const { input } = opts;
  //     const newUser: User = {
  //       id: (_users.length + 1).toString(),
  //       name: input.name,
  //       email: input.email,
  //     };
  //     _users.push(newUser);
  //     return newUser;
  //   }),
});

export type AppRouter = typeof appRouter;
