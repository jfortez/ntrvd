import { TrpcClient } from "@repo/trpc/client";

const trpcClient = new TrpcClient("http://localhost:3000/trpc");

export const trpc = trpcClient.trpc!;
export const queryClient = trpcClient.queryClient!;
