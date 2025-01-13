"use client";

import { skipToken } from "@tanstack/react-query";
import { apiClient } from "manipulator/clients/next/react";
import React from "react";
import { useAppStore } from "~/store/provider";

// retrieves data, then adds to store
export const useSyncTasks = () => {
  // const initTasks = useAppStore((state) => state.initTasks);
  const addTasks = useAppStore((state) => state.addTasks);

  // todo: use infinite query once we implement pagination
  const [, query] = apiClient.task.getAllExtendedTasks.useSuspenseQuery();
  const getLastTaskId = (q: typeof query) => q.data?.at(-1)?.id ?? null;

  React.useEffect(() => {
    const tasks = query.data;
    if (!tasks) return;
    addTasks(tasks);
  }, [query.data, addTasks]);

  const [lastEventId, setLastEventId] = React.useState<false | null | number>(
    false,
  ); // false: query has not been run yet, null: empty list, number: event id

  // We should only set the lastEventId once, if the SSE-connection is lost, it will automatically reconnect and continue from the last event id
  // Changing this value will trigger a new subscription
  if (query.data && lastEventId === false) setLastEventId(getLastTaskId(query));

  // Subscribe to new tasks
  const subscription = apiClient.task.onTaskAdd.useSubscription(
    lastEventId === false ? skipToken : { lastEventId },
    {
      onData(event) {
        if (!event.data) return;
        addTasks([event.data]);
        setLastEventId(event.data.id);
      },
      onError(err) {
        // If we've lost connection, resubscribe from the last event
        console.error("Subscription error:", err);
        const tasks = query.data;
        if (tasks?.length) setLastEventId(getLastTaskId(query));
      },
    },
  );

  return {
    subscription,
  };
};
