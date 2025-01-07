import { Logger } from "../../../common/logger";
import { taskRepository } from "../repository/task.repository";
import type { CreateTaskInput } from "../repository/task.repository.types";

class TaskService {
  private readonly logger = new Logger(TaskService.name);

  public async getAllTasks() {
    return await taskRepository.getTasks();
  }

  public async createTask(task: CreateTaskInput) {
    return await taskRepository.createTask(task);
  }
}

export const taskService = new TaskService();
