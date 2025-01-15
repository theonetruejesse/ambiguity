import { createTRPCRouter } from "@/api/trpc";
import { userService } from "./services/user.service";
import { publicProcedure } from "@/api/common/procedures/public";

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(async () => {
    return await userService.getAllUsers();
  }),
});
