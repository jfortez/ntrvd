import { QueryClientProvider } from "@tanstack/react-query";
import { TrpcClient } from "./trpc";

export const TrpcProvider = ({ children }: { children: React.ReactNode }) => {
  const instance = TrpcClient.getInstance();
  if (!instance) {
    throw new Error(
      "TrpcClient is not initialized. Please ensure it is created before using the provider."
    );
  }

  return <QueryClientProvider client={instance.queryClient!}>{children}</QueryClientProvider>;
};
``;
