import { StateCreator } from "zustand";
import type {
  TaskObject,
  TasksGrouped,
  StatusTypes,
  UpdateTaskStatusArgs,
} from "./tasks.types";
import { STATUS_TYPES } from "~/constants";

export interface TasksSlice {
  tasks: TasksGrouped | null;
  // initTasks: (startingTasks: TaskObject[]) => void;
  addTasks: (newTasks: TaskObject[]) => void;
  updateTaskStatus: (args: UpdateTaskStatusArgs) => void;
  getTasks: (status: StatusTypes) => TaskObject[];
}

export const createTasksSlice: () => StateCreator<
  TasksSlice,
  [],
  [],
  TasksSlice
> = () => (set, get) => ({
  // tasks: null,
  // initTasks: (startingTasks: TaskObject[]) => {
  //   console.log("initTasks", startingTasks);
  //   if (get().tasks) return;
  //   console.log("setting tasks");
  //   set(() => {
  //     return {
  //       tasks: _helpers.groupByStatus(startingTasks),
  //     };
  //   });
  // },
  tasks: _helpers.groupByStatus([]),

  addTasks: (newTasks: TaskObject[]) => {
    const tasks = get().tasks;
    if (!tasks) return;
    set(() => ({
      tasks: _helpers.mergeTasks(tasks, newTasks),
    }));
  },

  updateTaskStatus: (args: UpdateTaskStatusArgs) => {
    const tasks = get().tasks;
    if (!tasks) return;
    set(() => {
      const { taskId, oldStatus, newStatus } = args;

      // Find task to move
      const taskToMove = tasks[oldStatus].find((task) => task.id === taskId);
      if (!taskToMove) return { tasks };

      const oldStatusTasks = tasks[oldStatus].filter(
        (task) => task.id !== taskId,
      );

      const newStatusTasks = [
        ...tasks[newStatus],
        { ...taskToMove, status: newStatus },
      ];

      return {
        tasks: {
          ...tasks,
          [oldStatus]: oldStatusTasks,
          [newStatus]: newStatusTasks,
        },
      };
    });
  },

  getTasks: (status: StatusTypes) => {
    const tasks = get().tasks;
    if (!tasks) return [];
    return tasks[status];
  },
});

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

  mergeTasks: (
    existingTasks: TasksGrouped,
    newTasks: TaskObject[],
  ): TasksGrouped => {
    return newTasks.reduce(
      (acc, newTask) => ({
        ...acc,
        [newTask.status]: [...acc[newTask.status], newTask],
      }),
      { ...existingTasks },
    );
  },
};
