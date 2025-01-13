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
import { useSyncTasks } from "./_hooks/useTasks";
import { SubscriptionStatus } from "./_components/subscription";
import { Suspense } from "react";
// import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export default function TasksPage() {
  return (
    // <ErrorBoundary/>
    <Suspense fallback={<div>Loading tasks...</div>}>
      <TasksContent />
    </Suspense>
    // </ErrorBoundary>
  );
}

function TasksContent() {
  const tasks = useSyncTasks();

  return (
    <div>
      <SubscriptionStatus subscription={tasks.subscription} />
      <Accordion type="multiple" defaultValue={STATUS_TYPES}>
        {STATUS_TYPES.map((status) => (
          <TaskGroup status={status} key={status} />
        ))}
      </Accordion>
    </div>
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
