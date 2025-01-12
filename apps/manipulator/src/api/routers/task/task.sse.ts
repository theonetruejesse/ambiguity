import { tracked } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../../procedures/public";
import type { ExtendedTaskObject } from "./repository/task.repository.types";
import { taskService } from "./services/task.service";
import { ee } from "../../common/emitter";

export const onTaskAdd = publicProcedure
  .input(
    z.object({
      // lastEventId is the last event id that the client has received
      // On the first call, it will be whatever was passed in the initial setup
      // If the client reconnects, it will be the last event id that the client received
      lastEventId: z.number().nullish(),
      // orgId: z.string().uuid(), // which taskmaster group to listen to
    })
  )
  .subscription(async function* ({ input, signal }) {
    // We start by subscribing to the ee so that we don't miss any new events while fetching
    // Passing the AbortSignal from the request automatically cancels the event emitter when the request is aborted
    const iterable = ee.toIterable("add", {
      signal,
    });
    console.log("1", iterable);
    let lastTaskCreatedAt = await (async () => {
      const lastEventId = input.lastEventId;
      if (!lastEventId) return null;
      const itemById = await taskService.getExtendedTaskById(lastEventId);
      return itemById?.createdAt ?? null;
    })();
    console.log("2", lastTaskCreatedAt);
    function* maybeYield(task: ExtendedTaskObject) {
      // // ignore tasks from other orgs - the event emitter can emit from other orgs
      // if (task.orgId !== input.orgId) return
      // ignore tasks that we've already sent:
      // happens if there is a race condition between the query and the event emitter
      if (lastTaskCreatedAt && task.createdAt <= lastTaskCreatedAt) return;
      yield tracked(task.id.toString(), task);
      lastTaskCreatedAt = task.createdAt;
    }
    const tasksSinceLastest = lastTaskCreatedAt
      ? await taskService.getExtendedTasksSince(lastTaskCreatedAt)
      : [];
    // yield the tasks we fetched from the db
    for (const task of tasksSinceLastest) yield* maybeYield(task);
    console.log("3");
    // yield any new tasks from the event emitter
    for await (const [task] of iterable) yield* maybeYield(task);
    console.log("4");
  });
