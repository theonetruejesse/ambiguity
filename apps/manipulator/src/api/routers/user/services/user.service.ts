import { Logger } from "../../../common/logger";
import { userRepository } from "../repository/user.repository";

class UserService {
  private readonly logger = new Logger(UserService.name);

  // adjust to server specific later
  public async getAllUsers() {
    return await userRepository.getUsers();
  }
}

export const userService = new UserService();
