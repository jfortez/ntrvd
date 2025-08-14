import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { AuthContextType } from "@/providers/Auth";
import type { TRPCOptions } from "@repo/trpc/client";
import type { QueryClient } from "@tanstack/react-query";

type RouteContext = {
  auth: AuthContextType;
  trpc: TRPCOptions;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
