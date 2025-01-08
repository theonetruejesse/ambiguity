import { z } from "zod";
import { createTRPCRouter } from "../../trpc";
import { publicProcedure } from "../../procedures/public";
import { taskService } from "./services/task.service";

export const taskRouter = createTRPCRouter({
  getAllTasks: publicProcedure.query(async () => {
    return await taskService.getAllTasks();
  }),
  createTask: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        content: z.string(),
        channelId: z.string(),
        messageId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await taskService.createTask(input);
    }),
});
