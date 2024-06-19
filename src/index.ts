console.clear()
import { Client, Collection } from "discord.js";
import { Command, SlashCommand } from "./types";
import { readdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { color } from "./functions";
config()

if (!process.env.BOT_TOKEN){
    console.log(color("text", `⛔️ Add the bot token to the ${color("variable", ".env")} file`))
    process.exit(1);
}

const client = new Client({ intents: 131071 })
client.slashCommands = new Collection<string, SlashCommand>()
client.commands = new Collection<string, Command>()
client.cooldowns = new Collection<string, number>()

const handlersDir = join(__dirname, "./handlers")
readdirSync(handlersDir).forEach(handler => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client)
})

client.login(process.env.BOT_TOKEN)
