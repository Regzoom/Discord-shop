import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
import ProductModel from "../schemas/Products";
import { approved_roles, roles } from "../config";

const command : Command = {
    name: "inventory",
    execute: async (message, args) => {
        const roles = await message.member!.roles.cache
        const hasrole = roles.filter(role => approved_roles.includes(role.id))
        if (hasrole.size == 0) return await message.reply({ content: "Вы не можете использовать эту команду!" });
        if (args.length < 2) {
            return await message.reply({ content: "Укажите название продукта" });
        }

        const countProducts = await ProductModel.countDocuments({ name: args[1] });
        return await message.reply({ content: `В данный момент в инвентаре ${countProducts} ${args[1]}` });
    },
    cooldown: 10,
    aliases: ["инвентарь"],
    permissions: [PermissionFlagsBits.Administrator]
}

export default command