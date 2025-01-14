import type { RedisClientType } from "redis";

const KEYS = ["TODO_CHANNELS"] as const; // todo, ts bindings on this

// client for redis exposing queries
export class RedisClient {
  private readonly redis: RedisClientType;

  constructor(redis: RedisClientType) {
    this.redis = redis;
  }

  public async getTodoChannels() {
    return await this.redis.sMembers("TODO_CHANNELS");
  }

  public async addTodoChannel(channelId: string) {
    return await this.redis.sAdd("TODO_CHANNELS", channelId);
  }

  // redis client bindings
  connect = async (): Promise<void> => {
    await this.redis.connect();
    return;
  };
  isReady = () => this.redis.isReady;
}
