import { bot } from "./bot";

bot.once("ready", () => {
  if (bot.user) console.log(`Logged in as ${bot.user.tag}`);
  else console.error("Failed to login");
});
