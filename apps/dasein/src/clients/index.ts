// tokens the ids used to register dependencies in the container
import type { ApiClient } from "manipulator/clients/vanilla";
import { BotClient } from "./Bot";
import { RedisClient } from "./Redis";
import { container } from "tsyringe";

abstract class Registry {
  public static IBotToken = Symbol("IBotToken");
  public static IRedisClient = Symbol("IRedisClient");
  public static IApiClient = Symbol("IApiClient");
}

// class interface for handling client construction; using dependency injection pattern
class ClientContainer {
  init(bot: BotClient, redis: RedisClient, api: ApiClient) {
    container.registerInstance<BotClient>(Registry.IBotToken, bot);
    container.registerInstance<RedisClient>(Registry.IRedisClient, redis);
    container.registerInstance<ApiClient>(Registry.IApiClient, api);
  }

  getBot = () => {
    const bot = container.resolve<BotClient>(Registry.IBotToken);
    if (!bot.user) throw new Error("Bot user not found");
    return bot;
  };

  getRedis = () => {
    const redis = container.resolve<RedisClient>(Registry.IRedisClient);
    if (!redis.isReady()) throw new Error("Redis client is not connected");
    return redis;
  };

  getApi = () => {
    const api = container.resolve<ApiClient>(Registry.IApiClient);
    return api;
  };
}

// singleton object
export const Clients = new ClientContainer();
