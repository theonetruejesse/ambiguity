import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

// slash commands not working for some reason

@Discord()
export class Slashes {
  @Slash({ description: "add channel to db" })
  async add_channel(interaction: CommandInteraction): Promise<void> {
    // console.log("here for ping");
    console.log(interaction.channel, interaction.channelId);
    await interaction.reply("pong!");
  }
}
