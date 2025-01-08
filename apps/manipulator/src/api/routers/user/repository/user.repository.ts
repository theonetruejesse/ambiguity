import { db } from "../../../../database/db";
import { Logger } from "../../../common/logger";
import { USER_ID_TYPES, type GetUserInput } from "./user.repository.types";

class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  public async getUsers(input?: GetUserInput) {
    if (!input) return await db.selectFrom("User").selectAll().execute();

    let query = db.selectFrom("User").selectAll();

    if (input.type === USER_ID_TYPES.USER) {
      const numericIds = input.ids.map((id) => Number(id));
      return await query.where("id", "in", numericIds).execute();
    }

    return await query.where(input.type, "in", input.ids).execute();
  }
}

export const userRepository = new UserRepository();
