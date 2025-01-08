// "use-client";

import { api } from "manipulator/clients/next";

type Tasks = Awaited<ReturnType<typeof api.task.getAllTasks>>;

interface DashboardProps {
  tasks: Tasks;
}

export const Dashboard = ({ tasks }: DashboardProps) => {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{task.content}</div>
      ))}
    </div>
  );
};
