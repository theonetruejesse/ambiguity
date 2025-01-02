// import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { taskService } from "./services/task.service";

export const taskRouter = createTRPCRouter({
  getAllTasks: publicProcedure.query(async () => {
    return await taskService.getAllTasks();
  }),
});
