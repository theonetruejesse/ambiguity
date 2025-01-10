import { api, HydrateClient, RouterOutputs } from "manipulator/clients/next";
import { Dashboard } from "./_components/dashboard";

export default async function TasksPage() {
  const tasks = await api.task.getAllExtendedTasks();

  return (
    <HydrateClient>
      <Dashboard tasks={tasks} />
    </HydrateClient>
  );
}
