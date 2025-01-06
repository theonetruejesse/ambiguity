// tokens the ids used to register dependencies in the container
import { BotClient } from "./bot";
import { RedisClient } from "./Redis";
import { container } from "tsyringe";

abstract class Registry {
  public static IBotToken = Symbol("IBotToken");
  public static IRedisClient = Symbol("IRedisClient");
}

// class interface for handling client construction; using dependency injection pattern
class ClientContainer {
  init(bot: BotClient, redis: RedisClient) {
    container.registerInstance<BotClient>(Registry.IBotToken, bot);
    container.registerInstance<RedisClient>(Registry.IRedisClient, redis);
  }

  getBot = () => {
    const bot = container.resolve<BotClient>(Registry.IBotToken);
    if (!bot.user) throw new Error("Bot user not found");
    return bot;
  };

  getRedis = () => container.resolve<RedisClient>(Registry.IRedisClient);
}

// singleton object
export const Clients = new ClientContainer();
