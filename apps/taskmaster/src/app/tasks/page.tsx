"use client";

import { TaskRow } from "./_components/dashboard";
import { Table, TableBody } from "~/components/ui/table";
import { STATUS_TYPES } from "~/constants";
import type { StatusTypes, TaskObject } from "~/store/tasks.types";
import { useAppStore } from "~/store/provider";
import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default function TasksPage() {
  return (
    <Accordion type="multiple" defaultValue={STATUS_TYPES}>
      {STATUS_TYPES.map((status) => (
        <TaskGroup status={status} key={status} />
      ))}
    </Accordion>
  );
}
const TaskGroup = ({ status }: { status: StatusTypes }) => {
  const tasks = useAppStore(
    useMemo(() => (state) => state.getTasks(status), [status]),
  );

  return (
    <AccordionItem value={status} defaultValue={status}>
      <AccordionTrigger>{status}</AccordionTrigger>
      <AccordionContent>
        <Table>
          <TableBody>
            {tasks.map((task: TaskObject) => (
              <TaskRow task={task} key={task.id} />
            ))}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  );
};
