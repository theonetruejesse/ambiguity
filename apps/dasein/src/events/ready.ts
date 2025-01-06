import "reflect-metadata";

import { container } from "tsyringe";
import { Client, Discord, On, type ArgsOf } from "discordx";
import { Beans } from "../models/framework/DI/Beans";
import { Events } from "discord.js";
import chalk from "chalk";

@Discord()
export class Ready {
  @On({ event: Events.ClientReady })
  clientReady([_client]: ArgsOf<Events.ClientReady>): void {
    const bot = container.resolve<Client>(Beans.IBotToken);

    if (!bot.user) throw new Error("Bot user not found");

    bot.initApplicationCommands();

    console.log(`
			██████╗  █████╗ ███████╗███████╗██╗███╗   ██╗
			██╔══██╗██╔══██╗██╔════╝██╔════╝██║████╗  ██║
			██║  ██║███████║███████╗█████╗  ██║██╔██╗ ██║
			██║  ██║██╔══██║╚════██║██╔══╝  ██║██║╚██╗██║
			██████╔╝██║  ██║███████║███████╗██║██║ ╚████║
			╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝
			${chalk.dim(`Logged in as ${bot.user.tag}`)}`);
  }
}
