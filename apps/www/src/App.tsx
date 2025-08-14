import { RouterProvider, createRouter } from "@tanstack/react-router";

import { TrpcProvider } from "@repo/trpc/client";
import AuthProvider, { useAuth } from "@/providers/Auth";
import { routeTree } from "./routeTree.gen";
import { trpc, queryClient } from "./utils/trpc";

const router = createRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: "intent",
  context: {
    auth: undefined!,
    trpc: undefined!,
    queryClient: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const AppInner = () => {
  const auth = useAuth();

  return <RouterProvider router={router} context={{ auth, trpc, queryClient }} />;
};

const App = () => {
  return (
    <TrpcProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </TrpcProvider>
  );
};

export default App;
