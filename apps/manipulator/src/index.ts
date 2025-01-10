import { appRouter } from "./api/root";
import { createTRPCContext } from "./api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { serve } from "bun";

const PORT = 4000;

console.log("Starting server on port", PORT);

// The function that dispatches tRPC requests
async function trpcHandler(req: Request) {
  const url = new URL(req.url);

  // Define common CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Use "*" for development; replace with specific origin in production
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-trpc-source",
    "Access-Control-Allow-Credentials": "true",
  };

  // Handle CORS Preflight (OPTIONS requests)
  if (req.method === "OPTIONS")
    return new Response(null, {
      status: 204, // HTTP No Content
      headers: corsHeaders, // Attach CORS headers to preflight response
    });

  if (url.pathname.startsWith("/trpc")) {
    const response = await fetchRequestHandler({
      endpoint: "/trpc",
      req,
      router: appRouter,
      createContext: () => createTRPCContext({ headers: req.headers }),
      onError: (opts) => console.log("Error", opts),
    });

    // Add CORS headers to the tRPC response
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }

    return response;
  }

  if (url.pathname.startsWith("/trpc")) {
    return fetchRequestHandler({
      endpoint: "/trpc",
      req,
      router: appRouter,
      createContext: () => createTRPCContext({ headers: req.headers }),
      onError: (opts) => console.log("Error", opts),
    });
  }

  return new Response("Not found", { status: 404 });
}

serve({
  port: PORT,
  fetch: (req) => trpcHandler(req),
});
