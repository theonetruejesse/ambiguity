import type { IdsTypeInput } from "../../../common/helpers";

// mapping to the database column name
export const USER_ID_TYPES = {
  USER: "id",
  CLERK: "clerkId",
  DISCORD: "discordId",
} as const;

export type GetUserInput = IdsTypeInput<typeof USER_ID_TYPES>;
