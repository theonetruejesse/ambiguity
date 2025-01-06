import { createTRPCClient } from "@trpc/client";
import type { AppRouter } from "../../src/api/root";
import { trpcLinks } from "../shared";

export const api = (url: string) =>
  createTRPCClient<AppRouter>({
    links: trpcLinks(url, "vanilla"),
  });
