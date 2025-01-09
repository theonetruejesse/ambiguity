import { z } from "zod";
import { createTRPCRouter } from "../../trpc";
import { publicProcedure } from "../../procedures/public";
import { taskService } from "./services/task.service";

export const taskRouter = createTRPCRouter({
  getAllTasks: publicProcedure
    .input(z.object({ isExtended: z.boolean() }))
    .query(async ({ input: { isExtended } }) => {
      return await taskService.getAllTasks(isExtended);
    }),

  createTasks: publicProcedure
    .input(
      z.array(
        z.object({
          userId: z.number(),
          content: z.string(),
          channelId: z.string(),
          messageId: z.string(),
        })
      )
    )
    .mutation(async ({ input }) => {
      return await taskService.createTasks(input);
    }),

  createChannel: publicProcedure
    .input(
      z.object({
        id: z.string(),
        channelName: z.string(),
        categoryName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await taskService.createChannel(input);
    }),
});
