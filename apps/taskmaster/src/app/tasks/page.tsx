"use client";

import { TaskRow } from "./_components/dashboard";
import { Table, TableBody } from "~/components/ui/table";
import { STATUS_TYPES } from "~/constants";
import type { StatusTypes, TaskObject } from "~/store/tasks.types";
import { useAppStore } from "~/store/provider";
import { useMemo } from "react";

export default function TasksPage() {
  return (
    <>
      {STATUS_TYPES.map((status) => (
        <TaskGroup status={status} key={status} />
      ))}
    </>
  );
}

const TaskGroup = ({ status }: { status: StatusTypes }) => {
  const tasks = useAppStore(
    useMemo(() => (state) => state.getTasks(status), [status]),
  );

  return (
    <div>
      <Table>
        <TableBody>
          {tasks.map((task: TaskObject) => (
            <TaskRow task={task} key={task.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
