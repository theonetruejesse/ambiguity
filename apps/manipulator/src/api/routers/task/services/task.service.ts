import { Logger } from "../../../common/logger";
import { taskRepository } from "../repository/task.repository";
import {
  TASK_ID_TYPES,
  type CreateChannelInput,
  type CreateTaskInput,
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
    return await taskRepository.createTasks(tasks);
    // todo: emit event
  }

  public async createChannel(channel: CreateChannelInput) {
    return await taskRepository.createChannel(channel);
  }
}

export const taskService = new TaskService();
