import { api, HydrateClient } from "manipulator/clients/next";
import { Dashboard } from "./_components/dashboard";

export default async function TasksPage() {
  const tasks = await api.task.getAllTasks();

  return (
    <HydrateClient>
      <h1>hello world</h1>
      <Dashboard tasks={tasks} />
    </HydrateClient>
  );
}
