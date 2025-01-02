import { db } from "~/server/database/db";
import { Logger } from "~/server/api/common/logger";

class TaskRepository {
  private readonly logger = new Logger(TaskRepository.name);

  public async getTasks(userId?: string) {
    const tasks = db
      .selectFrom("Task")
      .selectAll()
      .$if(!!userId, (qb) => qb.where("userId", "=", userId!))
      .execute();

    return tasks;
  }
}

export const taskRepository = new TaskRepository();
