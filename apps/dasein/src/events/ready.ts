import { Discord, On, type ArgsOf } from "discordx";
import { Events } from "discord.js";
import chalk from "chalk";
import { CLIENTS } from "../client";

@Discord()
export class Ready {
  @On({ event: Events.ClientReady })
  clientReady([_client]: ArgsOf<Events.ClientReady>): void {
    const bot = CLIENTS.getBot();

    if (!bot.user) throw new Error("Bot user not found");

    bot.initApplicationCommands();

    console.log(ascii, chalk.dim(`Logged in as ${bot.user.tag}\n`));
  }
}

const ascii = `
██████╗  █████╗ ███████╗███████╗██╗███╗   ██╗
██╔══██╗██╔══██╗██╔════╝██╔════╝██║████╗  ██║
██║  ██║███████║███████╗█████╗  ██║██╔██╗ ██║
██║  ██║██╔══██║╚════██║██╔══╝  ██║██║╚██╗██║
██████╔╝██║  ██║███████║███████╗██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝
`;
