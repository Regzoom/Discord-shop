import { ActionRowBuilder, ButtonBuilder, ButtonStyle, DMChannel, ModalSubmitInteraction, TextChannel } from "discord.js";
import UserModel from "../../schemas/User";
import * as config from "../../config";
import OrderModel from "../../schemas/Order";

export default class kazamiDEVModal {
    async run(interaction: ModalSubmitInteraction) {
        const entry = await UserModel.findOne({ ticket_id: interaction.channel!.id }).exec();

        if (!entry) {
            return await interaction.reply({ content: "Произошла непредвиденная ошибка, попробуйте еще раз", flags: 64 });
        };

        const name = interaction.fields.getTextInputValue("product_name");
        const price = interaction.fields.getTextInputValue("product_price").split(" ");
        const channel = await interaction.guild!.channels.fetch(config.ticketsLogs_channel) as TextChannel;

        const order = new OrderModel({
            seller: interaction.user.id,
            name: name,
            valute: price[1],
            price: Number(price[0]),
            buyer: entry.id,
        })

        await order.save()

        await channel!.send({ embeds: [{
            "description": `# ${interaction.user} закрыл тикет __\`${name}\`__ на __\`${price[0] + price[1]}\`__\n<t:${Date.now()}:F>\n<@${entry._id}> \`678203623708033024\``,
            "color": 10535045
        }] });
    
        entry.active_ticket = false;
        await entry.save()

        const feedbackButton = new ButtonBuilder()
        .setLabel("Оставить отзыв")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/channels/${interaction.guild!.id}/${config.feedback_channel}`)

        const row = [new ActionRowBuilder<ButtonBuilder>().addComponents(feedbackButton)]
        const dm = await interaction.guild?.members.cache.get(entry._id)!.createDM() as DMChannel

        if (dm) {
            dm.send({ content: `Не забудьте оставить отзыв о проделанной работе!`, components: row })
        }

        await interaction.reply({ content: "тикет закрыт" })
        return await interaction.channel!.delete()
    }
}