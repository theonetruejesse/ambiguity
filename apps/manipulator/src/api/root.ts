import { taskRouter } from "./routers/task/task.router";
import { userRouter } from "./routers/user/user.router";
import { createTRPCRouter, createCallerFactory } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
const appRouter = createTRPCRouter({
  task: taskRouter,
  user: userRouter,
});

// export type definition of API
type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter);

export { appRouter, createCaller, type AppRouter };
