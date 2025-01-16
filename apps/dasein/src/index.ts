import "reflect-metadata";

import { dirname, join } from "path";
import { importx } from "@discordx/importer";
import { NotBot } from "@discordx/utilities";
import { GatewayIntentBits } from "discord.js";
import { createClient, type RedisClientType } from "redis";
import { BotClient } from "./clients/Bot";
import { RedisClient } from "./clients/Redis";
import { __prod__, API_URL } from "./constants";
import { Clients } from "./clients";
import { api } from "manipulator/clients/vanilla";

const currentDir = dirname(__filename);

abstract class Main {
  private static readonly bot = new BotClient({
    botGuilds: __prod__ ? undefined : [process.env.GUILD_ID as string],
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

  private static readonly api = api(API_URL);

  private static async initClients() {
    await this.redis.connect();
    Clients.init(this.bot, this.redis, this.api);
  }

  public static async run() {
    await this.initClients();
    await importx(join(currentDir, "{events,commands}/**/*.{ts,js}"));

    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }

    await this.bot.login(process.env.BOT_TOKEN);
  }
}

Main.run();
