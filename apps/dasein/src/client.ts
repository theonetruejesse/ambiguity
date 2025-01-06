// tokens the ids used to register dependencies in the container

import type { Client as DiscordClient } from "discordx";
import type { RedisClientType } from "redis";
import { container } from "tsyringe";

abstract class Registry {
  public static IBotToken = Symbol("IBotToken");
  public static IRedisClient = Symbol("IRedisClient");
}

class ClientContainer {
  init(bot: DiscordClient, redis: RedisClientType) {
    container.registerInstance<DiscordClient>(Registry.IBotToken, bot);
    container.registerInstance<RedisClientType>(Registry.IRedisClient, redis);
  }

  getBot() {
    const bot = container.resolve<DiscordClient>(Registry.IBotToken);
    if (!bot) throw new Error("Bot not found");
    return bot as DiscordClient;
  }

  getRedis() {
    return container.resolve<RedisClientType>(Registry.IRedisClient);
  }
}

// singleton object
export const CLIENTS = new ClientContainer();
