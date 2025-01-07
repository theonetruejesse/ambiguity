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
    const newTask = db.insertInto("Task").values(task).execute();
    return newTask;
  }
}

export const taskRepository = new TaskRepository();
