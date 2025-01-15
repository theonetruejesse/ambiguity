import type { Selectable } from "kysely";
import type { IdsTypeInput } from "@/api/common/helpers";
import type { User } from "@/database/db.types";

// mapping to the database column name
export const USER_ID_TYPES = {
  USER: "id",
  CLERK: "clerkId",
  DISCORD: "discordId",
} as const;

export type GetUserInput = IdsTypeInput<typeof USER_ID_TYPES>;

export type UserQuery = Selectable<User>;
