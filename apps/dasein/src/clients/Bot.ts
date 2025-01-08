import { Client as DiscordClient, type ClientOptions } from "discordx";

// we extend the discordx client to manage internal state
export class BotClient extends DiscordClient {
  private validChannels: Set<string> = new Set();
  private serverUsers: Map<string, number> = new Map(); // discord id -> db id

  constructor(options: ClientOptions) {
    super(options);
  }

  public setTodoChannels(channels: string[]) {
    this.validChannels = new Set(channels);
  }

  public isTodoChannel(channel: string) {
    return this.validChannels.has(channel);
  }

  public setServerUsers(users: Map<string, number>) {
    this.serverUsers = users;
  }

  public getUserDbId(discordId: string) {
    const id = this.serverUsers.get(discordId);
    if (!id) throw new Error("User not found");
    return id;
  }
}
