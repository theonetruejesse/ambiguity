import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

// slash commands not working for some reason

@Discord()
export class Example {
  @Slash({ description: "ping" })
  async ping(interaction: CommandInteraction): Promise<void> {
    console.log("here for ping");
    await interaction.reply("pong!");
  }
}
