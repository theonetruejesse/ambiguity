import { Discord, On, type ArgsOf } from "discordx";
import { Events } from "discord.js";
import { Clients } from "../clients";
import chalk from "chalk";

@Discord()
export class Ready {
  @On({ event: Events.ClientReady })
  async clientReady([_client]: ArgsOf<Events.ClientReady>): Promise<void> {
    const bot = Clients.getBot();

    bot.initApplicationCommands();

    await this._setServerUsers();
    await this._setTodoUsers();

    console.log(ascii, chalk.dim(`Logged in as ${bot.user?.tag}\n`));
  }

  private async _setServerUsers() {
    const api = Clients.getApi();
    const bot = Clients.getBot();

    const users = await api.user.getAllUsers.query(); // todo: should be changed to discord server specific
    const userMap = new Map<string, number>(
      users.map((user) => [user.discordId, user.id])
    );
    bot.setServerUsers(userMap);
  }

  private async _setTodoUsers() {
    const bot = Clients.getBot();
    const redis = Clients.getRedis();

    const todoChannels = await redis.getTodoChannels();
    bot.setTodoChannels(todoChannels);
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
