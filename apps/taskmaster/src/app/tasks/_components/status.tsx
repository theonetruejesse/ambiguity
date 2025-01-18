"use client";

import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { apiClient } from "@ambiguity/manipulator/clients/next"; 
import type { StatusTypes } from "~/store/tasks.types";
import { useAppStore } from "~/store/provider";

type Status = {
  type: StatusTypes;
  label: string;
  color: string;
};
const statuses: Status[] = [
  {
    type: "TODO",
    label: "Todo",
    color: "bg-status-todo",
  },
  {
    type: "DOING",
    label: "Doing",
    color: "bg-status-doing",
  },
  {
    type: "DONE",
    label: "Done",
    color: "bg-status-done",
  },
];

interface TaskStatusProps {
  statusType: StatusTypes;
  taskId: number;
}

export const TaskStatus = ({ statusType, taskId }: TaskStatusProps) => {
  // todo, use react compiler to avoid cacheing the statuses
  const status = statuses.find((status) => status.type === statusType);
  if (!status) throw new Error("Status not found"); // conditional should be fine since error is thrown

  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Status>(status);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="status"
          className={cn(`w-auto ${selectedStatus.color}`)}
        >
          {selectedStatus.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0" align="start">
        <StatusList
          taskId={taskId}
          status={selectedStatus}
          setOpen={setOpen}
          setSelectedStatus={setSelectedStatus}
        />
      </PopoverContent>
    </Popover>
  );
};

interface StatusListProps {
  taskId: number;
  status: Status;
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status) => void;
}

const StatusList = ({
  taskId,
  status,
  setOpen,
  setSelectedStatus,
}: StatusListProps) => {
  const { mutate: updateServerTaskStatus } =
    apiClient.task.updateTaskStatus.useMutation();
  const updateClientTaskStatus = useAppStore((state) => state.updateTaskStatus);

  const findStatus = (value: string) => {
    const status = statuses.find((status) => status.type === value);
    if (!status) throw new Error("Status not found");
    return status;
  };
  const updateStatus = (value: string) => {
    const { type: oldStatus } = status;
    const { type: newStatus } = findStatus(value);

    setOpen(false); // optimistic update for good UX

    // only update if the status has changed
    if (oldStatus !== newStatus) {
      updateServerTaskStatus({ status: newStatus, id: taskId });
      updateClientTaskStatus({
        taskId,
        oldStatus,
        newStatus,
      });
    }
  };

  return (
    <Command>
      <CommandList>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.type}
              value={status.type}
              onSelect={() => updateStatus(status.type)}
            >
              <div
                className={`${status.color} rounded-md p-2 text-sm font-medium text-white`}
              >
                {status.label}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
