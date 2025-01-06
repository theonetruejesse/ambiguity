import { loggerLink } from "@trpc/client";
import { unstable_httpBatchStreamLink } from "@trpc/client";
import SuperJSON from "superjson";

export const trpcLinks = (url: string, source: string) => [
  loggerLink({
    enabled: (op) =>
      process.env.NODE_ENV === "development" ||
      (op.direction === "down" && op.result instanceof Error),
  }),
  unstable_httpBatchStreamLink({
    transformer: SuperJSON,
    url,
    headers: () => {
      const headers = new Headers();
      headers.set("x-trpc-source", source);
      // conversion to TRPC's internal HTTPHeaders type
      const plainHeaders: Record<string, string> = {};
      headers.forEach((value, key) => {
        plainHeaders[key] = value;
      });
      return plainHeaders;
    },
  }),
];
