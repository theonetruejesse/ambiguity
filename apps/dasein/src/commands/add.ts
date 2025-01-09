import { ChannelType, type CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { Clients } from "../clients";

// slash commands not working for some reason

@Discord()
export class AddSlashes {
  @Slash({ description: "add channel to db", name: "add_channel" })
  async addChannel(interaction: CommandInteraction): Promise<void> {
    const bot = Clients.getBot();
    const api = Clients.getApi();

    const channelId = interaction.channelId;
    const channel = await bot.channels.fetch(channelId); // interaction.channel is not working

    if (channel?.type !== ChannelType.GuildText) return;

    const channelName = channel.name;

    await api.task.createChannel.mutate({
      id: channelId,
      channelName,
      categoryName: channelName, // default category name
    });

    await interaction.reply(`${channelName} added!`);
  }
}
