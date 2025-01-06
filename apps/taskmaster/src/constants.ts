export const __prod__ = process.env.NODE_ENV === "production";

export const serverUrl = __prod__
  ? "https://my-railway-app-url.production/trpc" // TODO: update this
  : "http://localhost:4000/trpc";
