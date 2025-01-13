import { tracked } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../../procedures/public";
import { taskService } from "./services/task.service";
import { ee } from "../../common/emitter";
import { zExtendedTaskObject } from "./services/task.service.types";
import { zAsyncIterable } from "../../common/zAsyncIterator";

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
  .subscription(({ input: { lastEventId }, signal }) => {
    const subscriptionId = Math.random().toString(36).substring(7);
    console.log("[onTaskAdd] Creating subscription =>", subscriptionId);
    console.log(
      `[Subscription ${subscriptionId}] Starting with lastEventId:`,
      lastEventId
    );

    return (async function* () {
      const cleanup = new AbortController();
      let lastTaskCreatedAt: Date | null = null;

      try {
        // Get initial state
        if (lastEventId) {
          const itemById = await taskService.getExtendedTaskById(lastEventId);
          console.log(`[Subscription ${subscriptionId}] Last item:`, {
            id: itemById?.id,
            createdAt: itemById?.createdAt,
          });
          lastTaskCreatedAt = itemById?.createdAt ?? null;
        }

        // Setup iterable with combined abort signal
        const iterable = ee.toIterable("add", {
          signal: AbortSignal.any(
            [signal, cleanup.signal].filter(Boolean) as AbortSignal[]
          ),
        });

        // Get any missed tasks
        const tasksSinceLastest = lastTaskCreatedAt
          ? await taskService.getExtendedTasksSince(lastTaskCreatedAt)
          : [];

        // Yield any missed tasks first
        for (const task of tasksSinceLastest) {
          if (lastTaskCreatedAt && task.createdAt <= lastTaskCreatedAt) {
            continue;
          }
          yield tracked(task.id.toString(), task);
          lastTaskCreatedAt = task.createdAt;
        }

        // ============================
        // Inner try/catch around for-await
        // ============================
        try {
          // Stream new tasks
          for await (const [task] of iterable) {
            if (lastTaskCreatedAt && task.createdAt <= lastTaskCreatedAt) {
              continue;
            }
            yield tracked(task.id.toString(), task);
            lastTaskCreatedAt = task.createdAt;
          }
        } catch (innerErr) {
          if (innerErr instanceof Error && innerErr.name === "AbortError") {
            console.log(
              `[Subscription ${subscriptionId}] for-await aborted normally`
            );
          } else {
            console.error(
              `[Subscription ${subscriptionId}] for-await unknown error =>`,
              innerErr
            );
            throw innerErr; // Re-throw so outer catch can see it
          }
        }

        // If we exit the for-await loop normally, just return undefined
        return undefined;
      } catch (error) {
        // ============================
        // Outer catch
        // ============================
        if (error instanceof Error && error.name === "AbortError") {
          console.log(
            `[Subscription ${subscriptionId}] Connection aborted normally`
          );
          return undefined;
        }
        console.error(`[Subscription ${subscriptionId}] Outer catch =>`, error);
        throw error;
      } finally {
        cleanup.abort();
        console.log(`[Subscription ${subscriptionId}] Cleanup complete`);
      }
    })();
  });
