import { z } from "zod";
import { createTRPCRouter } from "../../trpc";
import { publicProcedure } from "../../procedures/public";
import { taskService } from "./services/task.service";
import { TaskStatus } from "../../../database/db.types";

export const taskRouter = createTRPCRouter({
  getAllExtendedTasks: publicProcedure.query(async () => {
    return await taskService.getAllExtendedTasks();
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

  updateTaskStatus: publicProcedure
    .input(z.object({ id: z.number(), status: z.nativeEnum(TaskStatus) }))
    .mutation(async ({ input }) => {
      return await taskService.updateTaskStatus(input);
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
