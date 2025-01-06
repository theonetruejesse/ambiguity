import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import { NotBot } from "@discordx/utilities";
import { GatewayIntentBits } from "discord.js";
import { Client } from "discordx";

import { createClient, type RedisClientType } from "redis";
import { CLIENTS } from "./client";

abstract class Main {
  private static readonly bot = new Client({
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

  private static readonly redis = createClient({
    url: process.env.REDIS_URL,
  });

  public static async run() {
    await this.redis.connect();
    CLIENTS.init(this.bot, this.redis as RedisClientType);

    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }

    await this.bot.login(process.env.BOT_TOKEN);
  }
}

Main.run();
