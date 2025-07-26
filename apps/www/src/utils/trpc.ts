import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../express-app/src/router";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { queryClient } from "./queryClient";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc/",
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
