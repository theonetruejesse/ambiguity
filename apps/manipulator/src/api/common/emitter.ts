import EventEmitter, { on } from "events";
import type { ExtendedTaskObject } from "../routers/task/repository/task.repository.types";

interface MyEvents {
  add: (task: ExtendedTaskObject) => void;
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

class MyEventEmitter extends EventEmitter {
  public toIterable<TEv extends keyof MyEvents>(
    event: TEv,
    opts: NonNullable<Parameters<typeof on>[2]>
  ): AsyncIterable<Parameters<MyEvents[TEv]>> {
    return on(this, event, opts) as any;
  }
}

export const ee = new MyEventEmitter();
