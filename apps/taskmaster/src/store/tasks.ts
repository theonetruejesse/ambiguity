import { StateCreator } from "zustand";
import type {
  TaskObject,
  TasksGrouped,
  StatusTypes,
  UpdateTaskStatusArgs,
} from "./tasks.types";
import { STATUS_TYPES } from "~/constants";

export interface TasksSlice {
  tasks: TasksGrouped;
  updateTaskStatus: (args: UpdateTaskStatusArgs) => void;
  getTasks: (status: StatusTypes) => TaskObject[];
}

export const createTasksSlice: (
  startingTasks: TaskObject[],
) => StateCreator<TasksSlice, [], [], TasksSlice> =
  (startingTasks: TaskObject[]) => (set, get) => {
    const initialTasks = _helpers.groupByStatus(startingTasks);

    return {
      tasks: initialTasks,

      updateTaskStatus: (args: UpdateTaskStatusArgs) => {
        set((state) => {
          const { taskId, oldStatus, newStatus } = args;

          // Find task to move
          const taskToMove = state.tasks[oldStatus].find(
            (task) => task.id === taskId,
          );
          if (!taskToMove) return state;

          // Create new arrays for old and new status
          const oldStatusTasks = state.tasks[oldStatus].filter(
            (task) => task.id !== taskId,
          );
          const newStatusTasks = [
            ...state.tasks[newStatus],
            { ...taskToMove, status: newStatus },
          ];

          // Return new state with updated task arrays
          return {
            tasks: {
              ...state.tasks,
              [oldStatus]: oldStatusTasks,
              [newStatus]: newStatusTasks,
            },
          };
        });
      },

      getTasks: (status: StatusTypes) => {
        return get().tasks[status];
      },
    };
  };

const _helpers = {
  groupByStatus: (tasks: TaskObject[]): TasksGrouped => {
    // Initialize with empty arrays for each status
    const initial: TasksGrouped = STATUS_TYPES.reduce(
      (acc, status) => ({ ...acc, [status]: [] }),
      {} as TasksGrouped,
    );

    // Group tasks by status
    return tasks.reduce((grouped, task) => {
      grouped[task.status] = [...grouped[task.status], task];
      return grouped;
    }, initial);
  },
};
