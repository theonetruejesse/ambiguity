import { Logger } from "../../../common/logger";
import { taskRepository } from "../repository/task.repository";

class TaskService {
  private readonly logger = new Logger(TaskService.name);

  public async getAllTasks() {
    return await taskRepository.getTasks();
  }
}

export const taskService = new TaskService();
