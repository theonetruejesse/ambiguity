import { api, HydrateClient } from "manipulator/clients/next";
import { Dashboard } from "./_components/dashboard";

export default async function TasksPage() {
  const tasks = await api.task.getAllTasks({ isExtended: true });

  return (
    <HydrateClient>
      <Dashboard tasks={tasks} />
    </HydrateClient>
  );
}
