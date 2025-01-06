import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import { NotBot } from "@discordx/utilities";
import { GatewayIntentBits } from "discord.js";
import { createClient, type RedisClientType } from "redis";
import { Clients } from "./clients";
import { BotClient } from "./clients/bot";
import { RedisClient } from "./clients/Redis";

abstract class Main {
  private static readonly bot = new BotClient({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
    ],

    silent: false,

    allowedMentions: {
      parse: ["users"],
    },

    guards: [NotBot],

    simpleCommand: {
      prefix: "!",
    },
  });

  private static readonly redis = new RedisClient(
    createClient({
      url: process.env.REDIS_URL,
    }) as RedisClientType
  );

  public static async run() {
    await this.redis.connect();
    Clients.init(this.bot, this.redis);

    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }

    await this.bot.login(process.env.BOT_TOKEN);
  }
}

Main.run();
