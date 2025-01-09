import type { Task } from "../../../../database/db.types";
import type { IdsTypeInput } from "../../../common/helpers";
import { USER_ID_TYPES } from "../../user/repository/user.repository.types";

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "status">;

// export type TaskIdTypes = "TASK_ID" | UserIdType;

// type UserIdType = "USER_ID" | "CLERK_ID" | "DISCORD_ID"; // clerk id is currently unstable to used

// export type GetTaskInput = {
//   id: string;
//   type: TaskIdTypes;
// };

// mapping to the database column name
export const TASK_ID_TYPES = {
  ...USER_ID_TYPES,
  USER: "userId", // override the user id type
  TASK: "id",
} as const;

export type GetTaskInput = IdsTypeInput<typeof TASK_ID_TYPES>;

export type CreateChannelInput = {
  id: string;
  channelName: string;
  categoryName: string;
};
