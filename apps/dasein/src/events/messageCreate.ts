import { Events } from "discord.js";
import { Discord, On, type ArgsOf } from "discordx";

@Discord()
export class MessageCreate {
  @On({ event: Events.MessageCreate })
  messageCreate([message]: ArgsOf<Events.MessageCreate>): void {
    // const bot = CLIENTS.getBot();
    // if (!bot.user) throw new Error("Bot user not found");

    console.log("message:", message.content);
  }
}
