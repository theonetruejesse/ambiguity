import { Events } from "discord.js";
import { Discord, On, type ArgsOf } from "discordx";
import { Clients } from "../clients";

@Discord()
export class MessageCreate {
  @On({ event: Events.MessageCreate })
  messageCreate([message]: ArgsOf<Events.MessageCreate>): void {
    const bot = Clients.getBot();

    if (bot.isTodoChannel(message.channel.id))
      console.log("message:", message.content);
  }
}
