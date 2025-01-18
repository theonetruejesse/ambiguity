import { NotBot } from "@discordx/utilities";
import { GatewayIntentBits } from "discord.js";
import { createClient, type RedisClientType } from "redis";
import { BotClient } from "./clients/Bot";
import { RedisClient } from "./clients/Redis";
import { __prod__, API_URL } from "./constants";
import { Clients } from "./clients";
import { api } from "@ambiguity/manipulator/clients/vanilla";
import { dirname, importx, resolve } from "@discordx/importer";
import fs from "fs";

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

    // dynamic imports from dist
    const files = `${dirname(import.meta.url)}/{events,commands}/*.js`;
    await importx(files);
    // console.log("Importing files from:", files);
    // const resolvedPaths = await resolve(files);
    // console.log("Resolved paths:", resolvedPaths);

    if (!process.env.BOT_TOKEN) {
      throw Error("Could not find BOT_TOKEN in your environment");
    }
    console.log("Starting to import commands and events...");
    await this.bot.login(process.env.BOT_TOKEN);
    console.log("Commands and events imported successfully");
  }
}

Main.run();
