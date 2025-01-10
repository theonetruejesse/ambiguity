"use client";
// every component in /tasks is a client component since we use zustand in layout.tsx

import { TaskRow } from "./_components/dashboard";
import { Table, TableBody } from "~/components/ui/table";
import { useAppStore } from "~/store/provider";

export default function TasksPage() {
  const tasks = useAppStore((state) => state.tasks);

  return (
    <div>
      <Table>
        <TableBody>
          {tasks.map((task) => (
            <TaskRow task={task} key={task.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
