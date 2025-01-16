"use client";

import React from "react";
import { skipToken } from "@tanstack/react-query";
import { apiClient } from "next/react";
import { useAppStore } from "~/store/provider";
import { ExtendedTaskObject } from "manipulator/src/api/routers/task/repository/task.repository.types";

export const useSyncTasks = () => {
  const addTasks = useAppStore((state) => state.addTasks);

  // 1) Load all tasks initially with a suspense query
  //    If tasks change (refetch?), we’ll re-check the lastEventId
  const [_, query] = apiClient.task.getAllExtendedTasks.useSuspenseQuery();
  const tasks = query.data ?? [];

  // 2) Keep a local state for lastEventId
  //    `null` means we haven't decided on an ID yet.
  const [lastEventId, setLastEventId] = React.useState<number | null>(null);

  // 3) Whenever the query finishes, update the store and figure out lastEventId
  React.useEffect(() => {
    console.log("[useSyncTasks] getAllExtendedTasks =>", tasks);

    // Put tasks in your global store
    if (tasks.length > 0) {
      addTasks(tasks);
    }

    // If we never set lastEventId yet, use the last item from the query
    if (tasks.length > 0 && lastEventId === null) {
      const newId = tasks.at(-1)!.id;
      console.log(`[useSyncTasks] Setting lastEventId to ${newId}`);
      setLastEventId(newId);
    }
  }, [tasks, lastEventId, addTasks]);

  // 4) Only subscribe if we actually have a lastEventId
  //    If we pass skipToken, no subscription call is made
  const subscriptionInput = lastEventId === null ? skipToken : { lastEventId };

  // 5) Subscribe to new tasks
  const subscription = apiClient.task.onTaskAdd.useSubscription(
    subscriptionInput,
    {
      onData(event) {
        console.log("[useSyncTasks] SSE onData =>", event);
        if (!event?.data) return;

        // Add the new task to the store
        addTasks([event.data as ExtendedTaskObject]);

        // Update lastEventId to the newly created task’s ID
        setLastEventId(event.data.id);
      },
      onError(err) {
        console.error("[useSyncTasks] SSE onError =>", err);

        // If the error is an AbortError, it's a "clean" disconnect (e.g. page navigation)
        if (err instanceof Error && err.name === "AbortError") {
          console.log("[useSyncTasks] SSE subscription aborted normally");
          return;
        }

        // Otherwise, attempt to reconnect from the last known task if we have any
        if (tasks.length > 0) {
          const newId = tasks.at(-1)!.id;
          console.log(
            `[useSyncTasks] Trying to reconnect from last known task #${newId}`,
          );
          setLastEventId(newId);
        }
      },
    },
  );

  // 6) (Optional) Watch subscription status changes for debug
  React.useEffect(() => {
    console.log(
      `[useSyncTasks] subscription status => ${subscription?.status}`,
    );
  }, [subscription?.status]);

  return { subscription };
};
