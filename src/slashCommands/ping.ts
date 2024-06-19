import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { getThemeColor } from "../functions";
import { SlashCommand } from "../types";

//
const command : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Посмотреть пинг бота")
    ,
    execute: interaction => {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`🏓 Понг! \n 📡 Пинг бота: ${interaction.client.ws.ping}`)
                .setColor(getThemeColor("text"))
            ]
        })
    },
    cooldown: 10
}

export default command