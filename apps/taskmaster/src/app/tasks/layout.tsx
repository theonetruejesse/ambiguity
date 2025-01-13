import { Suspense } from "react";
import { apiServer, HydrateClient } from "manipulator/clients/next/server";
import { AppStoreProvider } from "~/store/provider";

interface TasksLayoutProps {
  children: React.ReactNode;
}

export default async function TasksLayout({ children }: TasksLayoutProps) {
  await apiServer.task.getAllExtendedTasks.prefetch();

  return (
    <Suspense fallback={<div>Loading app state...</div>}>
      <HydrateClient>
        <AppStoreProvider>{children}</AppStoreProvider>
      </HydrateClient>
    </Suspense>
  );
}
