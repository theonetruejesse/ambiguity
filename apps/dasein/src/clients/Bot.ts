import { Client as DiscordClient, type ClientOptions } from "discordx";

// we extend the discordx client to manage internal state
export class BotClient extends DiscordClient {
  private validChannels: Set<string> = new Set();

  constructor(options: ClientOptions) {
    super(options);
  }

  public setTodoChannels(channels: string[]) {
    this.validChannels = new Set(channels);
  }

  public isTodoChannel(channel: string) {
    return this.validChannels.has(channel);
  }
}
