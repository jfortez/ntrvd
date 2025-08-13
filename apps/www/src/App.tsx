import { RouterProvider, createRouter } from "@tanstack/react-router";

import { TrpcProvider } from "@repo/trpc/client";
import AuthProvider from "@/providers/AuthProvider";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <TrpcProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TrpcProvider>
  );
};

export default App;
