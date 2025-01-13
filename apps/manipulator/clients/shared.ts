import {
  loggerLink,
  httpBatchLink,
  unstable_httpBatchStreamLink,
  splitLink,
  unstable_httpSubscriptionLink,
} from "@trpc/client";
import SuperJSON from "superjson";

export const linkConfigs = {
  // adjust this to work with dasein as well
  loggerLink: loggerLink({
    enabled: (op) =>
      process.env.NODE_ENV === "development" ||
      (op.direction === "down" && op.result instanceof Error),
  }),
  httpBatchLink: (url: string, source: string) =>
    httpBatchLink({
      url,
      transformer: SuperJSON,
      headers: () => createHeaders(source),
    }),
  // httpBatchStreamLink: (url: string, source: string) =>
  //   unstable_httpBatchStreamLink({
  //     transformer: SuperJSON,
  //     headers: () => createHeaders(source),
  //     url,
  //   }),
  splitLink: (url: string, source: string) =>
    splitLink({
      condition: (op) => op.type === "subscription",
      true: unstable_httpSubscriptionLink({
        url,
        transformer: SuperJSON,
        eventSourceOptions: {
          withCredentials: true,
          headers: () => createHeaders(source),
          retry: false,
          timeout: 30000,
        },
      }),
      false: unstable_httpBatchStreamLink({
        url,
        transformer: SuperJSON,
        headers: () => createHeaders(source),
      }),
    }),
};

const createHeaders = (source: string) => {
  const headers = new Headers();
  headers.set("x-trpc-source", source);

  // Add any additional headers needed for authentication/session
  if (typeof window !== "undefined") {
    // Only in browser context
    headers.set("Connection", "keep-alive");
    headers.set("Cache-Control", "no-cache");
  }

  // conversion to TRPC's internal HTTPHeaders type
  const plainHeaders: Record<string, string> = {};
  headers.forEach((value, key) => {
    plainHeaders[key] = value;
  });
  return plainHeaders;
};
