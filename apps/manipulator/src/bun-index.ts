// import { appRouter } from "./api/root";
// import { createTRPCContext } from "./api/trpc";
// import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
// import { serve } from "bun";

// const PORT = 4000;

// console.log("Starting server on port", PORT);

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("[Global] unhandledRejection =>", reason);
// });
// process.on("uncaughtException", (err) => {
//   console.error("[Global] uncaughtException =>", err);
// });

// // Also log when the server process is about to exit:
// ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
//   process.on(signal, () => {
//     console.log(`[Global] Received signal ${signal}, shutting down.`);
//     // optionally process.exit(1);
//   });
// });

// // The function that dispatches tRPC requests
// async function trpcHandler(req: Request) {
//   const url = new URL(req.url);
//   console.log("fetchHandler:", {
//     method: req.method,
//     url: url.href,
//     // @ts-ignore
//     headers: [...req.headers],
//   });
//   // Define common CORS headers
//   const corsHeaders = {
//     "Access-Control-Allow-Origin": "http://localhost:3000", // todo, add prod origin
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//     "Access-Control-Allow-Credentials": "true",
//     "Access-Control-Allow-Headers":
//       "Content-Type, Authorization, x-trpc-source, trpc-accept, cache-control",
//   };

//   // Handle CORS Preflight (OPTIONS requests)
//   if (req.method === "OPTIONS")
//     return new Response(null, {
//       status: 204, // HTTP No Content
//       headers: corsHeaders, // Attach CORS headers to preflight response
//     });

//   if (url.pathname.startsWith("/trpc")) {
//     console.log("[trpcHandler] About to call fetchRequestHandler with", {
//       url: url.toString(),
//       method: req.method,
//       accept: req.headers.get("accept"),
//       // ...
//     });

//     const response = await fetchRequestHandler({
//       endpoint: "/trpc",
//       req,
//       router: appRouter,
//       createContext: () => createTRPCContext({ headers: req.headers }),
//       onError: (opts) => {
//         console.log("onError =>", {
//           path: opts.path,
//           code: opts.error.code,
//           message: opts.error.message,
//           cause: opts.error.cause,
//           stack: opts.error.stack,
//         });
//       },
//     });
//     console.log(
//       "[trpcHandler] fetchRequestHandler returned =>",
//       response.status
//     );

//     // Add CORS headers to the tRPC response
//     for (const [key, value] of Object.entries(corsHeaders)) {
//       response.headers.set(key, value);
//     }
//     // DEBUG: Log them after
//     console.log(
//       "DEBUG SSE HEADERS (after) =>",
//       JSON.stringify(response.headers.toJSON())
//     );

//     return response;
//   }

//   return new Response("Not found", { status: 404 });
// }

// serve({
//   port: PORT,
//   fetch: (req) => trpcHandler(req),
// });
