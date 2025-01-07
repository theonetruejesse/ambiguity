import { Events } from "discord.js";
import { Discord, On, type ArgsOf } from "discordx";
import { Clients } from "../clients";

@Discord()
export class MessageCreate {
  @On({ event: Events.MessageCreate })
  async messageCreate([message]: ArgsOf<Events.MessageCreate>): Promise<void> {
    const bot = Clients.getBot();
    const api = Clients.getApi();

    const tasks = await api.task.getAllTasks.query();
    console.log(tasks);

    if (bot.isTodoChannel(message.channel.id))
      console.log("message:", message.content);
  }
}
