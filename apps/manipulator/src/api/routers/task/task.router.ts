import { createTRPCRouter } from "../../trpc";
import { publicProcedure } from "../../procedures/public";
import { taskService } from "./services/task.service";

export const taskRouter = createTRPCRouter({
  getAllTasks: publicProcedure.query(async () => {
    return await taskService.getAllTasks();
  }),
});
