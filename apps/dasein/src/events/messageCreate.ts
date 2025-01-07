import { Events } from "discord.js";
import { Discord, On, type ArgsOf } from "discordx";
import { Clients } from "../clients";

@Discord()
export class MessageCreate {
  @On({ event: Events.MessageCreate })
  async messageCreate([message]: ArgsOf<Events.MessageCreate>): Promise<void> {
    const bot = Clients.getBot();
    const api = Clients.getApi();

    if (!bot.isTodoChannel(message.channel.id)) return;
    // todo handle ping logic

    // created task then broke shit

    // const tasks = await api.task.createTask.mutate({
    //   content: message.content,
    //   userId: message.author.id,
    //   channelId: message.channel.id,
    //   messageId: message.id,
    // });
    // console.log(tasks);

    console.log("tasks:", await api.task.getAllTasks.query());
  }
}
