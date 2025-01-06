import { Discord, On, type ArgsOf } from "discordx";
import { Events } from "discord.js";
import chalk from "chalk";
import { Clients } from "../clients";

@Discord()
export class Ready {
  @On({ event: Events.ClientReady })
  async clientReady([_client]: ArgsOf<Events.ClientReady>): Promise<void> {
    const bot = Clients.getBot();
    const redis = Clients.getRedis();

    bot.initApplicationCommands();
    bot.setTodoChannels(await redis.getTodoChannels());

    console.log(ascii, chalk.dim(`Logged in as ${bot.user?.tag}\n`));
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
