import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const TaskStatus = {
    TODO: "TODO",
    DOING: "DOING",
    DONE: "DONE"
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export type Task = {
    id: Generated<number>;
    content: string;
    userId: string;
    channelId: string;
    messageId: string;
    status: Generated<TaskStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    Task: Task;
};
