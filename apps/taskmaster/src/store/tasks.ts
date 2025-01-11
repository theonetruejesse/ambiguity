import { StateCreator } from "zustand";
import type { TaskObject, TasksGrouped, StatusTypes } from "./tasks.types";
import { STATUS_TYPES } from "~/constants";

export interface TasksSlice {
  tasks: TasksGrouped;
  updateTaskStatus: (task: TaskObject, status: StatusTypes) => void;
  getTasks: (status: StatusTypes) => TaskObject[];
}

export const createTasksSlice: (
  startingTasks: TaskObject[],
) => StateCreator<TasksSlice, [], [], TasksSlice> =
  (startingTasks: TaskObject[]) => (set, get) => {
    const initialTasks = _helpers.groupByStatus(startingTasks);

    return {
      tasks: initialTasks,

      updateTaskStatus: (task: TaskObject, status: StatusTypes) => {
        set((state) => {
          const newTasks = { ...state.tasks };
          newTasks[task.status] = newTasks[task.status].filter(
            (t) => t.id !== task.id,
          );
          newTasks[status] = [...newTasks[status], { ...task, status }];
          return { tasks: newTasks };
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
