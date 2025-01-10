import { apiServer, HydrateClient } from "manipulator/clients/next/server";
import { TaskRow } from "./_components/dashboard";
import { Table, TableBody } from "~/components/ui/table";

export default async function TasksPage() {
  const tasks = await apiServer.task.getAllExtendedTasks();

  return (
    <HydrateClient>
      <div>
        <Table>
          <TableBody>
            {tasks.map((task) => (
              <TaskRow task={task} key={task.id} />
            ))}
          </TableBody>
        </Table>
      </div>
    </HydrateClient>
  );
}
