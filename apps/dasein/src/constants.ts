import "reflect-metadata";

export const __prod__ = process.env.NODE_ENV === "production";

// todo, adjust for prod
export const API_URL = __prod__
  ? "http://localhost:4000/trpc"
  : "http://localhost:4000/trpc";
