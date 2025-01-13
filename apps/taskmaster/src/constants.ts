export const __prod__ = process.env.NODE_ENV === "production";

export const serverUrl = __prod__
  ? "http://localhost:4000/trpc"
  : "http://localhost:4000/trpc";
// ? "https://my-railway-app-url.production/trpc" // TODO: update this to the actual railway app url

import { StatusTypes } from "./store/tasks.types";

export const STATUS_TYPES: StatusTypes[] = ["TODO", "DOING", "DONE"];
