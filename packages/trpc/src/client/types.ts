import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../server";

export type Inputs = inferRouterInputs<AppRouter>;
export type Outputs = inferRouterOutputs<AppRouter>;

export type TRPCOptions = TRPCOptionsProxy<AppRouter>;
