import { apiServer, HydrateClient } from "manipulator/clients/next/server";
import { AppStoreProvider } from "~/store/provider";

interface TasksLayoutProps {
  children: React.ReactNode;
}

export default async function TasksLayout({ children }: TasksLayoutProps) {
  const tasks = await apiServer.task.getAllExtendedTasks();

  return (
    <HydrateClient>
      <AppStoreProvider startingTasks={tasks}>{children}</AppStoreProvider>
    </HydrateClient>
  );
}
