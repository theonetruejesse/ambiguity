import { Discord, On, type ArgsOf } from "discordx";
import { Events } from "discord.js";
import { Clients } from "../clients";
import chalk from "chalk";

@Discord()
export class Ready {
  @On({ event: Events.ClientReady })
  async clientReady([_client]: ArgsOf<Events.ClientReady>): Promise<void> {
    const bot = Clients.getBot();

    await this._setCommands();
    await this._setServerUsers();
    await this._setTodoUsers();

    console.log(ascii, chalk.dim(`Logged in as ${bot.user?.tag}\n`));
  }

  private async _setCommands() {
    const bot = Clients.getBot();
    await bot.clearApplicationCommands(); // might be for testing only
    await bot.initApplicationCommands();
    console.log("commands set");
  }

  private async _setServerUsers() {
    const api = Clients.getApi();
    const bot = Clients.getBot();

    const users = await api.user.getAllUsers.query(); // todo: should be changed to discord server specific
    const userMap = new Map<string, number>(
      users.map((user: any) => [user.discordId, user.id]) // todo -> temp; user typing is not being inferred
    );
    bot.setServerUsers(userMap);
    console.log("server users set");
  }

  private async _setTodoUsers() {
    const bot = Clients.getBot();
    const redis = Clients.getRedis();

    const todoChannels = await redis.getTodoChannels();
    bot.setTodoChannels(todoChannels);
    console.log("todo users set");
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
