import { Events } from "discord.js";
import { Discord, On, type ArgsOf } from "discordx";
import { Clients } from "../clients";

@Discord()
export class InteractionCreate {
  private static readonly MAX_SAFE_DEFER_RESPONSE_WAIT = 2500; // don't wait until 3000ms as there may be some delay
  private static readonly DISCORDX_PAGINATION_ID = "pagination"; // @discordx/pagination handled this for us

  @On({ event: Events.InteractionCreate })
  public async interactionCreate([
    interaction,
  ]: ArgsOf<Events.InteractionCreate>) {
    console.log("interactionCreate");
    const hasRecievedTooLate =
      Date.now() >
      interaction.createdTimestamp +
        InteractionCreate.MAX_SAFE_DEFER_RESPONSE_WAIT;

    const isManaged =
      (interaction.isButton() || interaction.isStringSelectMenu()) &&
      interaction.customId
        .toLowerCase()
        .includes(InteractionCreate.DISCORDX_PAGINATION_ID);

    if (hasRecievedTooLate || isManaged) {
      return;
    }

    const bot = Clients.getBot();
    bot.executeInteraction(interaction);
  }
}
