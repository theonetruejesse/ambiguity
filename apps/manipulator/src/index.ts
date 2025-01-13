import Fastify from "fastify";
import { appRouter } from "./api/root";
import { createTRPCContext } from "./api/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const PORT = 4000;

console.log("Starting server on port", PORT);

// Global error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Global] unhandledRejection =>", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[Global] uncaughtException =>", err);
});

// Log when the server process is about to exit
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, () => {
    console.log(`[Global] Received signal ${signal}, shutting down.`);
    // optionally process.exit(1);
  });
});

const fastify = Fastify({ logger: true });

// Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000", // TODO: Add production origin
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-trpc-source, trpc-accept, cache-control",
};

// Fastify middleware for tRPC
fastify.route({
  method: ["GET", "POST", "OPTIONS"],
  url: "/trpc/*",
  handler: async (request, reply) => {
    const { method, headers, raw } = request;

    // Handle CORS Preflight (OPTIONS requests)
    if (method === "OPTIONS") {
      reply
        .status(204) // HTTP No Content
        .headers(corsHeaders) // Attach CORS headers
        .send();
      return;
    }

    console.log("[tRPC Handler] Request details:", {
      method,
      url: raw.url,
      headers,
    });

    try {
      const response = await fetchRequestHandler({
        endpoint: "/trpc",
        req: new Request(`http://${request.hostname}${raw.url}`, {
          method: request.method,
          headers: request.headers as HeadersInit,
          body: method === "GET" ? undefined : JSON.stringify(request.body),
        }),
        router: appRouter,
        createContext: () =>
          createTRPCContext({ headers: new Headers(headers as HeadersInit) }),
        onError: (opts) => {
          console.error("onError =>", {
            path: opts.path,
            code: opts.error.code,
            message: opts.error.message,
            cause: opts.error.cause,
            stack: opts.error.stack,
          });
        },
      });

      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        reply.header(key, value);
      });

      reply.status(response.status).send(response.body);
    } catch (error) {
      console.error("Error in tRPC handler:", error);
      reply.status(500).send("Internal Server Error");
    }
  },
});

fastify.route({
  method: ["GET", "POST"],
  url: "/*",
  handler: (request, reply) => {
    reply.status(404).send("Not found");
  },
});

fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
