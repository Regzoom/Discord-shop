import { PermissionFlagsBits } from "discord.js";
import { Command } from "../types";
import ProductModel from "../schemas/Products";
import { approved_roles } from "../config";

const command : Command = {
    name: "getproduct",
    execute: async (message, args) => {
        const roles = await message.member!.roles.cache
        const hasrole = roles.filter(role => approved_roles.includes(role.id))
        if (hasrole.size == 0) return await message.reply({ content: "Вы не можете использовать эту команду!" });

        if (args.length != 2) return message.reply({ content: "Укажите название продукта." })

        const product = await ProductModel.findOne({ name: args[1] }).sort({ time: 1 }); 
        if (!product)  {
            message.reply({ content: "Такого товара нет." })
        }
        
        await message.reply({ content: product!.url })
        await product!.deleteOne();
    },
    cooldown: 10,
    aliases: ["получить"],
    permissions: [PermissionFlagsBits.Administrator]
}

export default command