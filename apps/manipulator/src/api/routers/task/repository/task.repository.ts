import { db } from "../../../../database/db";
import { TASK_ID_TYPES, type CreateTaskInput } from "./task.repository.types";
import { Logger } from "../../../common/logger";
import type {
  ChannelQuery,
  CreateChannelInput,
  ExtendedTaskQuery,
  // CreateTaskInput,
  GetTaskInput,
  TaskQuery,
  UpdateTaskStatusInput,
  // TaskIdTypes,
} from "./task.repository.types";
import { sql } from "kysely";
import type { UserQuery } from "../../user/repository/user.repository.types";

class TaskRepository {
  private readonly logger = new Logger(TaskRepository.name);

  public async getTasks(input?: GetTaskInput): Promise<TaskQuery[]> {
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
  ): Promise<ExtendedTaskQuery[]> {
    let query = db
      .selectFrom("Task as t")
      .innerJoin("User as u", "t.userId", "u.id")
      .innerJoin("Channel as c", "t.channelId", "c.id")
      .select([
        "t.id",
        "t.messageId",
        "t.content",
        "t.status",
        "t.createdAt",
        sql<ChannelQuery>`row_to_json("c")`.as("channel"),
        sql<UserQuery>`row_to_json("u")`.as("user"),
      ]);

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
