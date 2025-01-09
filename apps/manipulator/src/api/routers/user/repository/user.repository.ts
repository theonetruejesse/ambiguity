import { db } from "../../../../database/db";
import { Logger } from "../../../common/logger";
import { USER_ID_TYPES } from "./user.repository.types";
import type { GetUserInput, UserQuery } from "./user.repository.types";

class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  public async getUsers(input?: GetUserInput): Promise<UserQuery[]> {
    if (!input) return await db.selectFrom("User").selectAll().execute();

    let query = db.selectFrom("User").selectAll();

    if (input.type === USER_ID_TYPES.USER) {
      const numericIds = input.ids.map((id) => Number(id)); // todo, error handling with effect pipeline
      return await query.where("id", "in", numericIds).execute();
    }

    return await query.where(input.type, "in", input.ids).execute();
  }
}

export const userRepository = new UserRepository();
