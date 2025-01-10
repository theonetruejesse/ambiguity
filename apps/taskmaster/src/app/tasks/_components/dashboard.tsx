"use client";

import { TableCell, TableRow } from "~/components/ui/table";
import { TaskStatus } from "./status";
import type { Task } from "~/store/tasks";

export const TaskRow = ({ task }: { task: Task }) => {
  const { user, channel } = task;
  return (
    <TableRow>
      <TableCell className="font-medium">
        <PlaceholderIcon />
      </TableCell>
      <TableCell className="font-medium">{channel.categoryName}</TableCell>
      <TableCell className="font-medium">{task.content}</TableCell>
      <TableCell className="flex w-[120px] items-center justify-center">
        <TaskStatus statusType={task.status} taskId={task.id} />
      </TableCell>
    </TableRow>
  );
};

const PlaceholderIcon = () => {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200">
      JL
    </div>
  );
};
