import { Events, type Client } from "discord.js";
import { Discord, On, type ArgsOf } from "discordx";
// import { container } from "tsyringe";
// import { Beans } from "../models/framework/DI/Beans";

@Discord()
export class MessageCreate {
  @On({ event: Events.MessageCreate })
  messageCreate([message]: ArgsOf<Events.MessageCreate>): void {
    // const bot = container.resolve<Client>(Beans.IBotToken);

    // if (!bot.user) throw new Error("Bot user not found");

    console.log("message:", message.content);
  }
}
