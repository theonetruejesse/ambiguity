import { z } from "zod";
import { createTRPCRouter } from "../../trpc";
import { publicProcedure } from "../../procedures/public";
import { taskService } from "./services/task.service";
import type { CreateTaskInput } from "./repository/task.repository.types";

export const taskRouter = createTRPCRouter({
  getAllTasks: publicProcedure.query(async () => {
    return await taskService.getAllTasks();
  }),
  createTask: publicProcedure
    .input(
      z.object({
        content: z.string(),
        userId: z.string(),
        channelId: z.string(),
        messageId: z.string(),
      })
    )
    .mutation(async ({ input }: { input: CreateTaskInput }) => {
      return await taskService.createTask(input);
    }),
});
