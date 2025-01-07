import type { Task } from "../../../../database/db.types";

export type CreateTaskInput = Omit<Task, "id" | "createdAt" | "status">;
