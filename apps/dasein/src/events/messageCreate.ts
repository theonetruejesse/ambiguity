import { Events, Message } from "discord.js";
import { Discord, On, type ArgsOf } from "discordx";
import { Clients } from "../clients";

@Discord()
export class MessageCreate {
  @On({ event: Events.MessageCreate })
  async messageCreate([message]: ArgsOf<Events.MessageCreate>): Promise<void> {
    const bot = Clients.getBot();
    const helper = new MessageHelper(message);

    if (!bot.isTodoChannel(message.channel.id)) return;

    const users = helper.getUserDbIds();
    const taskContent = helper.removeMentions();

    if (!users) return;

    const isTaskCreated = await this._createTask(message, users, taskContent);
    if (!isTaskCreated) throw new Error("Task not created");
  }

  private async _createTask(
    message: Message,
    userIds: number[],
    taskContent: string
  ) {
    const api = Clients.getApi();

    return await api.task.createTasks.mutate(
      userIds.map((userId) => ({
        userId,
        content: taskContent,
        channelId: message.channel.id,
        messageId: message.id,
      }))
    );
  }
}

class MessageHelper {
  private message: Message;
  // dependency injection safe: message helper is called within messageCreate method
  private bot = Clients.getBot();

  constructor(message: Message) {
    this.message = message;
  }

  getUserDbIds() {
    const discordIds = this.message.mentions.users.map((user) => user.id);
    return discordIds.map((id) => this.bot.getUserDbId(id));
  }

  removeMentions() {
    return this.message.content.replace(/<@[^>]+>/g, "").trim();
  }
}
