import { db } from "../../../../database/db";
import { Logger } from "../../../common/logger";
import type { CreateTaskInput } from "./task.repository.types";

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

  public async createTask(task: CreateTaskInput) {
    try {
      await db.insertInto("Task").values(task).execute();
      return true;
    } catch (error) {
      this.logger.error("Failed to create task", error);
      return false;
    }
  }
}

export const taskRepository = new TaskRepository();
