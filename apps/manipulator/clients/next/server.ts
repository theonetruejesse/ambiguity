import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { createQueryClient } from "./query-client";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { createCaller } from "../../src/api/root";
import type { AppRouter } from "../../src/api/root";
import { createTRPCContext } from "../../src/api/trpc";
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext); // pretty sure i cant use this since no server-side calls?

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient
);
