import { RouterProvider, createRouter } from "@tanstack/react-router";

import { TrpcProvider } from "@repo/trpc/client";
import AuthProvider, { useAuth } from "@/providers/Auth";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const AppInner = () => {
  const auth = useAuth();
  console.log(auth);
  return <RouterProvider router={router} context={{ auth }} />;
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
