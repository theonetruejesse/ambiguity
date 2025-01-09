import { db } from "../../../../database/db";
import { TASK_ID_TYPES, type CreateTaskInput } from "./task.repository.types";
import { Logger } from "../../../common/logger";
import type {
  CreateChannelInput,
  // CreateTaskInput,
  GetTaskInput,
  // TaskIdTypes,
} from "./task.repository.types";

class TaskRepository {
  private readonly logger = new Logger(TaskRepository.name);

  public async getTasks(input?: GetTaskInput) {
    if (!input) return await db.selectFrom("Task").selectAll().execute();

    const { ids, type } = input;
    let query = db.selectFrom("Task").selectAll();

    if (type === TASK_ID_TYPES.TASK || type === TASK_ID_TYPES.USER) {
      const numericIds = input.ids.map((id) => Number(id));
      return await query.where(type, "in", numericIds).execute();
    }

    // need to test this a lot more
    return await query
      .innerJoin("User", "Task.userId", "User.id") // not sure if this is correct join
      .where(`User.${type}`, "in", ids)
      .execute();
  }

  public async createTasks(tasks: CreateTaskInput[]) {
    try {
      await db.insertInto("Task").values(tasks).execute();
      return true;
    } catch (error) {
      this.logger.error("Failed to create task", error);
      return false;
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
}

export const taskRepository = new TaskRepository();
