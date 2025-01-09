import type { Selectable } from "kysely";
import type { Channel, Task } from "../../../../database/db.types";
import type { IdsTypeInput } from "../../../common/helpers";
import {
  USER_ID_TYPES,
  type UserQuery,
} from "../../user/repository/user.repository.types";

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

export type TaskQuery = Selectable<Task>;

export type CreateChannelInput = {
  id: string;
  channelName: string;
  categoryName: string;
};

export type ChannelQuery = Selectable<Channel>;

export type ExtendedTaskQuery = Omit<TaskQuery, "channelId" | "userId"> & {
  channel: ChannelQuery;
  user: UserQuery;
};

// example object: {
//   id: 1,
//   content: "test",
//   status: "TODO",
//   createdAt: Date(),
//   channel: {
//     id: "1",
//     channelName: "test",
//     categoryName: "test",
//   },
//   user: {
//     id: 1,
//     clerkId: "1",
//     discordId: "1",
//     name: "test",
//     profileUrl: "test",
//   },
// };
