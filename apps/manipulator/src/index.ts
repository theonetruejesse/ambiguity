import { appRouter } from "./api/root";
import { createTRPCContext } from "./api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { serve } from "bun";

const PORT = 4000;

console.log("Starting server on port", PORT);

// The function that dispatches tRPC requests
async function trpcHandler(req: Request) {
  const url = new URL(req.url);

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
