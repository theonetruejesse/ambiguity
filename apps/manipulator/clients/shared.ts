import {
  loggerLink,
  httpBatchLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import SuperJSON from "superjson";

export const linkConfigs = {
  loggerLink: loggerLink({
    enabled: (op) =>
      process.env.NODE_ENV === "development" ||
      (op.direction === "down" && op.result instanceof Error),
  }),
  httpBatchLink: (url: string, source: string) =>
    httpBatchLink({
      transformer: SuperJSON,
      headers: () => createHeaders(source),
      url,
    }),
  httpBatchStreamLink: (url: string, source: string) =>
    unstable_httpBatchStreamLink({
      transformer: SuperJSON,
      headers: () => createHeaders(source),
      url,
    }),
};

const createHeaders = (source: string) => {
  const headers = new Headers();
  headers.set("x-trpc-source", source);
  // conversion to TRPC's internal HTTPHeaders type
  const plainHeaders: Record<string, string> = {};
  headers.forEach((value, key) => {
    plainHeaders[key] = value;
  });
  return plainHeaders;
};
