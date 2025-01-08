// import Link from "next/link";

import { api, HydrateClient } from "manipulator/clients/next";

export default async function Home() {
  const tasks = await api.task.getAllTasks();

  return (
    <HydrateClient>
      <main>
        <h1>hello world</h1>
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <div key={task.id}>{task.content}</div>
          ))}
        </div>
      </main>
    </HydrateClient>
  );
}
