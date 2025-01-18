import { publicProcedure } from "@/api/common/procedures/public";
import { zAsyncIterable } from "@/api/common/zAsyncIterator";
import { ee } from "@/api/common/emitter";
import { z } from "zod";
import { tracked } from "@trpc/server";
import { zExtendedTaskObject } from "./services/task.service.types";
import { taskService } from "./services/task.service";
import type { ExtendedTaskObject } from "./repository/task.repository.types";

export const onTaskAdd = publicProcedure
  .input(
    z.object({
      lastEventId: z.number().nullish(),
    })
  )
  .output(
    zAsyncIterable({
      yield: zExtendedTaskObject,
      tracked: true,
    })
  )
  .subscription(async function* ({ input: { lastEventId }, signal }) {
    // We start by subscribing to the ee so that we don't miss any new events while fetching
    // Passing the AbortSignal from the request automatically cancels the event emitter when the request is aborted
    const iterable = ee.toIterable("add", { signal });
    // console.log("Iterable initialized:", iterable);

    // Determine the timestamp of the last task the client received
    let lastTaskCreatedAt = await (async () => {
      if (!lastEventId) return null;
      const itemById = await taskService.getExtendedTaskById(lastEventId);
      // console.log("Last item fetched by ID:", itemById.id);
      return itemById?.createdAt ?? null;
    })();

    // console.log("Initial lastTaskCreatedAt:", lastTaskCreatedAt);

    // Fetch any tasks created since the last known task
    const tasksSinceLastest = lastTaskCreatedAt
      ? await taskService.getExtendedTasksSince(lastTaskCreatedAt)
      : [];
    // console.log("Tasks fetched since last known:", tasksSinceLastest);

    // Yield conditionally
    function* maybeYield(task: ExtendedTaskObject) {
      // Ignore tasks we've already sent:
      // This prevents sending duplicate tasks due to race conditions between the query and the event emitter
      if (lastTaskCreatedAt && task.createdAt <= lastTaskCreatedAt) return;
      yield tracked(task.id.toString(), task);
      lastTaskCreatedAt = task.createdAt;

      // implement later
      // if (post.channelId !== opts.input.channelId) {
      //   // ignore posts from other channels - the event emitter can emit from other channels
      //   return;
      // }
    }

    // Yield any tasks we fetched from the db
    for (const task of tasksSinceLastest) yield* maybeYield(task);
    // Yield any new tasks from the event emitter as they arrive
    for await (const [task] of iterable) yield* maybeYield(task);
  });
