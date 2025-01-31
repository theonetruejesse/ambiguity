import { db } from "@/database/db";
import {
  extendedTaskQuery,
  TASK_ID_TYPES,
  type CreateTaskInput,
} from "./task.repository.types";
import { Logger } from "@/api/common/logger";
import type {
  CreateChannelInput,
  ExtendedTaskObject,
  GetTaskInput,
  TaskObject,
  UpdateTaskStatusInput,
} from "./task.repository.types";

class TaskRepository {
  private readonly logger = new Logger(TaskRepository.name);

  public async getTasks(input?: GetTaskInput): Promise<TaskObject[]> {
    let query = db.selectFrom("Task").selectAll();

    if (!input) return await query.execute();

    const { ids, type } = input;
    if (type === TASK_ID_TYPES.TASK || type === TASK_ID_TYPES.USER) {
      const numericIds = input.ids.map((id) => Number(id));
      query = query.where(type, "in", numericIds);
    } else {
      query = query
        .innerJoin("User", "Task.userId", "User.id")
        .where(`User.${type}`, "in", ids);
    }

    return await query.execute();
  }

  public async getExtendedTasks(
    input?: GetTaskInput
  ): Promise<ExtendedTaskObject[]> {
    let query = extendedTaskQuery;

    if (!input) return await query.execute();

    const { ids, type } = input;
    if (type === TASK_ID_TYPES.TASK || type === TASK_ID_TYPES.USER) {
      const numericIds = ids.map((id) => Number(id));
      query = query.where(`t.${type}`, "in", numericIds);
    } else {
      query = query.where(`u.${type}`, "in", ids);
    }

    return await query.execute();
  }

  public async getExtendedTasksSince(lastDate: Date) {
    return await extendedTaskQuery
      .where("t.createdAt", ">", lastDate)
      .orderBy("t.createdAt", "asc")
      .execute();
  }

  public async createTasks(tasks: CreateTaskInput[]) {
    try {
      // Insert tasks and return full records in order
      const inserted = await db
        .insertInto("Task")
        .values(tasks)
        .returning(["id", "createdAt"])
        .execute();

      // probably not needed, but just to be safe
      // order by createdAt to ensure the order is guaranteed
      return inserted
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((i) => i.id);
    } catch (error) {
      this.logger.error("Failed to create task", error);
      throw new Error("Failed to create task");
    }
  }

  // can extend to createChannels
  public async createChannel(channel: CreateChannelInput) {
    try {
      const existingChannel = await db
        .selectFrom("Channel")
        .selectAll()
        .where("id", "=", channel.id)
        .executeTakeFirst();

      if (existingChannel) {
        this.logger.info("Channel with this ID already exists");
        return true;
      }

      await db.insertInto("Channel").values(channel).execute();
      return true;
    } catch (error) {
      this.logger.error("Failed to create channel", error);
      return false;
    }
  }

  public async updateTaskStatus(input: UpdateTaskStatusInput) {
    try {
      await db
        .updateTable("Task")
        .set({ status: input.status })
        .where("id", "=", input.id)
        .executeTakeFirst();
      return true;
    } catch (error) {
      this.logger.error("Failed to update task status", error);
      return false;
    }
  }
}

export const taskRepository = new TaskRepository();
