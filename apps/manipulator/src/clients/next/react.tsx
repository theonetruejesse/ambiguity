"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import type { AppRouter } from "../../api/root";
import { createQueryClient } from "./query-client";
import { linkConfigs } from "../shared";

const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return createQueryClient();
};

// use this for use-client components
export const apiClient = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: {
  baseUrl: string;
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    apiClient.createClient({
      links: [
        linkConfigs.loggerLink,
        linkConfigs.splitLink(props.baseUrl, "nextjs-react"),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <apiClient.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </apiClient.Provider>
    </QueryClientProvider>
  );
}
