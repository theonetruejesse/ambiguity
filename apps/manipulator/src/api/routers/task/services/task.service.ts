import { ee } from "../../../common/emitter";
import { Logger } from "../../../common/logger";
import { taskRepository } from "../repository/task.repository";
import {
  TASK_ID_TYPES,
  type CreateChannelInput,
  type CreateTaskInput,
  type ExtendedTaskObject,
  type UpdateTaskStatusInput,
} from "../repository/task.repository.types";

class TaskService {
  private readonly logger = new Logger(TaskService.name);

  public async getAllExtendedTasks() {
    return await taskRepository.getExtendedTasks();
  }

  public async getAllTasks() {
    return await taskRepository.getTasks();
  }

  // honestly should just make a singular query instead
  public async getExtendedTaskById(taskId: number) {
    const tasks = await taskRepository.getExtendedTasks({
      ids: [taskId.toString()],
      type: TASK_ID_TYPES.TASK,
    });
    if (tasks.length !== 1) throw new Error("Task not found");
    return tasks[0];
  }
  public async getExtendedTasksSince(lastDate: Date) {
    return await taskRepository.getExtendedTasksSince(lastDate);
  }

  public async updateTaskStatus(input: UpdateTaskStatusInput) {
    return await taskRepository.updateTaskStatus(input);
  }

  public async createTasks(tasks: CreateTaskInput[]) {
    // two queries: but preferable over optimizing my shitty code
    const taskIds = await taskRepository.createTasks(tasks);
    if (taskIds.length < 1) return [];

    const extendedTasks = await taskRepository.getExtendedTasks({
      ids: taskIds.map((id) => id.toString()),
      type: TASK_ID_TYPES.TASK,
    });
    if (extendedTasks.length < 1) return [];

    ee.emit("add", extendedTasks[0] as ExtendedTaskObject);
    return extendedTasks;
  }

  public async createChannel(channel: CreateChannelInput) {
    return await taskRepository.createChannel(channel);
  }
}

export const taskService = new TaskService();
