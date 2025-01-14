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
export type Channel = {
    id: string;
    channelName: string;
    categoryName: string;
};
export type Task = {
    id: Generated<number>;
    content: string;
    userId: number;
    messageId: string;
    channelId: string;
    status: Generated<TaskStatus>;
    createdAt: Generated<Timestamp>;
};
export type User = {
    id: Generated<number>;
    name: string;
    discordId: string;
    clerkId: string | null;
};
export type DB = {
    Channel: Channel;
    Task: Task;
    User: User;
};
