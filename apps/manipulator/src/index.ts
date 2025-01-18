import "dotenv/config";
import "source-map-support/register";
import Fastify from "fastify";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "./api/trpc";
import { appRouter } from "./api/root";
import { webUrl } from "./constants";

const fastify = Fastify({ logger: false });

// Common CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": webUrl,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-trpc-source, trpc-accept, cache-control",
};

fastify.route({
  method: ["GET"],
  url: "/health",
  handler: (_, reply) => {
    reply.status(200).send("OK");
  },
});

// Fastify tRPC bindings
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
          console.error("onError =>", opts);
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
  handler: (_request, reply) => {
    reply.status(404).send("Not found");
  },
});

fastify.listen({ port: 4000 }, (err: Error | null, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});
