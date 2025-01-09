import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

// slash commands not working for some reason

@Discord()
export class AddSlashes {
  @Slash({ description: "add channel to db", name: "add_channel" })
  async addChannel(interaction: CommandInteraction): Promise<void> {
    // console.log("here for ping");
    // console.log(interaction.channel, interaction.channelId);
    await interaction.reply("pong! 2");
  }
}
