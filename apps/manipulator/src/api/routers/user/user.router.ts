import { createTRPCRouter } from "../../trpc";
import { publicProcedure } from "../../procedures/public";
import { userService } from "./services/user.service";

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(async () => {
    return await userService.getAllUsers();
  }),
});
