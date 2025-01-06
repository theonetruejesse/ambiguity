// tokens the ids used to register dependencies in the container

import type { Client as DiscordClient } from "discordx";
import type { RedisClientType } from "redis";
import { container } from "tsyringe";

abstract class Registry {
  public static IBotToken = Symbol("IBotToken");
  public static IRedisClient = Symbol("IRedisClient");
}

// class interface for handling client construction; using dependency injection pattern
class ClientContainer {
  init(bot: DiscordClient, redis: RedisClientType) {
    container.registerInstance<DiscordClient>(Registry.IBotToken, bot);
    container.registerInstance<RedisClientType>(Registry.IRedisClient, redis);
  }

  getBot = () => container.resolve<DiscordClient>(Registry.IBotToken);
  getRedis = () => container.resolve<RedisClientType>(Registry.IRedisClient);
}

// singleton object
export const CLIENTS = new ClientContainer();
