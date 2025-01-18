import { createTRPCClient } from "@trpc/client";
import type { AppRouter } from "../../api/root";
import { linkConfigs } from "../shared";

export const api = (url: string) =>
  createTRPCClient<AppRouter>({
    links: [linkConfigs.loggerLink, linkConfigs.httpBatchLink(url, "vanilla")],
  });

export type ApiClient = ReturnType<typeof api>;
