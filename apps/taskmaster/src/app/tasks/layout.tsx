import { apiServer, HydrateClient } from "manipulator/clients/next/server";
import { AppStoreProvider } from "~/store/provider";

interface TasksLayoutProps {
  children: React.ReactNode;
}

export default async function TasksLayout({ children }: TasksLayoutProps) {
  void apiServer.task.getAllExtendedTasks.prefetch();

  return (
    <HydrateClient>
      <AppStoreProvider>{children}</AppStoreProvider>
    </HydrateClient>
  );
}
