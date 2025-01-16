import { type RouterOutputs } from "next/react";

export type TaskObject = RouterOutputs["task"]["getAllExtendedTasks"][number];

export type StatusTypes = TaskObject["status"];
export type TaskId = TaskObject["id"];

export type TasksGrouped = Record<StatusTypes, TaskObject[]>;

// args
export type UpdateTaskStatusArgs = {
  taskId: number;
  oldStatus: StatusTypes;
  newStatus: StatusTypes;
};
