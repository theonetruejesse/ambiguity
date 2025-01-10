import { StateCreator } from "zustand";
import { type RouterOutputs } from "manipulator/clients/next/react";

export type Task = RouterOutputs["task"]["getAllExtendedTasks"][number];

export interface TasksSlice {
  tasks: Task[];
  getTasks: () => Task[];
  setTasks: (tasks: Task[]) => void;
}

export const createTasksSlice: (
  startingTasks: Task[],
) => StateCreator<TasksSlice, [], [], TasksSlice> =
  (startingTasks: Task[]) => (set, get) => {
    return {
      tasks: startingTasks,
      getTasks: () => get().tasks,
      setTasks: (tasks: Task[]) => set({ tasks }),
    };
  };
