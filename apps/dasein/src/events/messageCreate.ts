import { Events, Message } from "discord.js";
import { Discord, On, type ArgsOf } from "discordx";
import { Clients } from "../clients";

@Discord()
export class MessageCreate {
  @On({ event: Events.MessageCreate })
  async messageCreate([message]: ArgsOf<Events.MessageCreate>): Promise<void> {
    const bot = Clients.getBot();
    const api = Clients.getApi();

    if (!bot.isTodoChannel(message.channel.id)) return;
    if (message.content.startsWith("!create")) {
      const isTaskCreated = await this._createTask(message);
    }
  }

  private async _createTask(message: Message) {
    const api = Clients.getApi();

    await api.task.createTask.mutate({
      content: message.content,
      userId: message.author.id,
      channelId: message.channel.id,
      messageId: message.id,
    });
  }
}
