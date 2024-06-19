import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest"
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";
import { Command, SlashCommand } from "../types";
import * as config from "../config"

module.exports = async (client : Client) => {
    const slashCommands : SlashCommandBuilder[] = []
    const commands : Command[] = []

    let slashCommandsDir = join(__dirname,"../slashCommands")
    let commandsDir = join(__dirname,"../commands")

    readdirSync(slashCommandsDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let command : SlashCommand = require(`${slashCommandsDir}/${file}`).default
        slashCommands.push(command.command)
        client.slashCommands.set(command.command.name, command)
    })

    readdirSync(commandsDir).forEach(file => {
        if (!file.endsWith(".js")) return;
        let command : Command = require(`${commandsDir}/${file}`).default
        commands.push(command)
        client.commands.set(command.name, command)
    })

    const rest = new REST({version: "10"}).setToken(process.env.BOT_TOKEN!);

    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: slashCommands.map(command => command.toJSON())
    })
    .then((data : any) => {
        console.log(color("text", `🔥 Успешно загруженно ${color("variable", data.length)} слеш команд(ы)`))
        console.log(color("text", `🔥 Успешно загруженно ${color("variable", commands.length)} команд(ы)`))
    }).catch(e => {
        console.log(e)
    })
}