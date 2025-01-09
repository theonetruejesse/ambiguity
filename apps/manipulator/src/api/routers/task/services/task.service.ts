import { Logger } from "../../../common/logger";
import { taskRepository } from "../repository/task.repository";
import type {
  CreateChannelInput,
  CreateTaskInput,
} from "../repository/task.repository.types";

class TaskService {
  private readonly logger = new Logger(TaskService.name);

  public async getAllTasks() {
    return await taskRepository.getTasks();
  }

  public async createTasks(tasks: CreateTaskInput[]) {
    return await taskRepository.createTasks(tasks);
  }

  public async createChannel(channel: CreateChannelInput) {
    return await taskRepository.createChannel(channel);
  }
}

export const taskService = new TaskService();
