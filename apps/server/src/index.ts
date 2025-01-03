const PORT = 3000;

console.log(`Server running on port: ${PORT}`);

Bun.serve({
  port: PORT,
  async fetch(req) {
    return trpcHandler(req);
  },
});

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "./api/trpc";
import { appRouter } from "./api/root";

const trpcHandler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  // If the request is for a tRPC endpoint
  if (url.pathname.startsWith("/trpc")) {
    // Delegate to the tRPC fetch handler
    return fetchRequestHandler({
      endpoint: "/trpc",
      req,
      router: appRouter, // Use your appRouter instance
      createContext: () =>
        createTRPCContext({
          headers: req.headers,
        }), // Your context creation logic
    });
  }

  // For other routes, fallback to 404
  return new Response("404!", { status: 404 });
};
