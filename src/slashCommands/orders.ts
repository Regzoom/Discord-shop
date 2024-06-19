import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../types";
import { type IOrder } from "../types";
import * as config from "../config";
import OrderModel from "../schemas/Order";

const manage: SlashCommand = {
    //@ts-ignore
    command: new SlashCommandBuilder()
        .setName("orders")
        .setDescription("Посмотреть выручку пользователя за неделю.")
        .addUserOption((option) =>
            option
                .setName("пользователь")
                .setDescription("Пользователь, у которого хотите узнать выручку.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction) => {
        const user = interaction.options.getUser("пользователь");

        const data = await OrderModel.find({ seller: user?.id })
        if (data.length == 0) return await interaction.reply({ embeds: [{
            title: "Ошибка",
            description: "Пользователь ничего не продал",
            thumbnail: {
                url: user!.avatarURL({ size: 512})!.toString()
            },
            color: config.errorEmbedColor
         }], ephemeral: true });
        
        const orders = {}
        data.forEach((order: IOrder) => {
            //@ts-ignore
            if (!orders[order.valute]) orders[order.valute] = 0
            //@ts-ignore
            orders[order.valute] += order.price
        })

        await interaction.reply({
            embeds: [{
                title: `Выручка пользователя ${user?.username} за неделю`,
                //@ts-ignore
                description: Object.keys(orders).map((key) => `\`${key}: ${orders[key]}\``).join("\n"),
                color: config.embedColor
            }]
        })
    },
    cooldown: 10,
};

export default manage;
