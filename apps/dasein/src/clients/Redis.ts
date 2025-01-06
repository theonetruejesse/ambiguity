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

  // redis client bindings
  connect = async () => await this.redis.connect();
  isReady = () => this.redis.isReady;
}
