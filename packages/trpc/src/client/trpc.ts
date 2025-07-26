import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { QueryClient } from "@tanstack/react-query";

export class TrpcClient {
  private static instance: TrpcClient | null = null;

  public readonly queryClient: QueryClient | undefined;
  private readonly trpcClient: ReturnType<typeof createTRPCClient<AppRouter>> | undefined;
  public readonly trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>> | undefined;

  constructor(url: string) {
    if (!url) {
      throw new Error("URL is required for TrpcClient initialization");
    }

    try {
      new URL(url);
    } catch (error) {
      throw new Error(`Invalid URL format: ${url}`);
    }

    if (TrpcClient.instance) {
      return TrpcClient.instance;
    }

    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
          gcTime: 5 * 60 * 1000, // 5 minutes
        },
        mutations: {
          retry: 1,
        },
      },
    });

    this.trpcClient = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url,
          headers: () => ({
            // headers
          }),
        }),
      ],
    });

    this.trpc = createTRPCOptionsProxy<AppRouter>({
      client: this.trpcClient,
      queryClient: this.queryClient,
    });

    TrpcClient.instance = this;

    this.queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          staleTime: 60 * 1000, // 1 minute
          retry: 1,
          gcTime: 5 * 60 * 1000, // 5 minutes
        },
        mutations: {
          retry: 1,
        },
      },
    });

    this.trpcClient = createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url,
          headers: () => ({
            // headers
          }),
        }),
      ],
    });

    this.trpc = createTRPCOptionsProxy<AppRouter>({
      client: this.trpcClient,
      queryClient: this.queryClient,
    });
  }

  public static getInstance(): TrpcClient {
    if (!TrpcClient.instance) {
      throw new Error("TrpcClient must be initialized with new TrpcClient(url) first");
    }
    return TrpcClient.instance;
  }
}
