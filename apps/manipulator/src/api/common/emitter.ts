"server-only";

import EventEmitter, { on } from "events";
import type { ExtendedTaskObject } from "../routers/task/repository/task.repository.types";

interface MyEvents {
  add: (task: ExtendedTaskObject) => void;
  error: (err: Error) => void;
}

declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

// Use a global variable to persist the instance across hot reloads
declare global {
  var __emitterInstance: MyEventEmitter | undefined;
}

class MyEventEmitter extends EventEmitter {
  private readonly instanceId: string;
  private activeConnections = new Set<string>();

  private constructor() {
    if (typeof window !== "undefined") {
      throw new Error("EventEmitter should only be instantiated on the server");
    }

    super();
    this.instanceId = Math.random().toString(36).substring(7);
    console.log(`[Server ${this.instanceId}] EventEmitter created`);

    // Track our specific "add" event
    this.on("add", (task) => {
      console.log(`[Server ${this.instanceId}] Task received:`, {
        taskId: task.id,
        createdAt: task.createdAt,
      });
    });
    this.on("error", (err) => {
      console.error("[MyEventEmitter] EventEmitter error =>", err);
    });
  }

  public static getInstance(): MyEventEmitter {
    if (typeof window !== "undefined") {
      throw new Error("EventEmitter should only be accessed on the server");
    }

    if (!global.__emitterInstance) {
      global.__emitterInstance = new MyEventEmitter();
    }
    return global.__emitterInstance;
  }

  public toIterable<TEv extends keyof MyEvents>(
    event: TEv,
    opts: NonNullable<Parameters<typeof on>[2]>
  ): AsyncIterable<Parameters<MyEvents[TEv]>> {
    try {
      const connectionId = Math.random().toString(36).substring(7);
      console.log(
        `[Server ${this.instanceId}] Creating iterable ${connectionId} for: ${event}`
      );

      this.activeConnections.add(connectionId);
      const iterable = on(this, event, opts) as any;

      opts.signal?.addEventListener(
        "abort",
        () => {
          console.log(
            `[Server ${this.instanceId}] Connection ${connectionId} aborted`
          );
          this.activeConnections.delete(connectionId);
        },
        { once: true }
      );

      return iterable;
    } catch (error) {
      console.error(`[Server ${this.instanceId}] Error in toIterable:`, {
        event,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  public getActiveConnections(): number {
    return this.activeConnections.size;
  }
}

export const ee = MyEventEmitter.getInstance();
