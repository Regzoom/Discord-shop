import {
    ActionRowBuilder,
    type ButtonInteraction,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    TextChannel,
    ButtonBuilder,
    DMChannel,
    type StringSelectMenuInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';

import * as config from '../../config';
import { createButtons } from '../../functions';
import UserModel from '../../schemas/User';

export default class Shop {
    async buy(interaction: StringSelectMenuInteraction, type: String) {
        await interaction.deferReply({ ephemeral: true })
        let entry = await UserModel.findOne({ _id: String(interaction.user.id!) }).exec()
        
        if (!entry) {
            const db = new UserModel({
                _id: interaction.user.id
            })

            await db.save()
        }

        entry = await UserModel.findOne({ _id: String(interaction.user.id) }).exec()

        if (!entry) {
            return await interaction.reply({ content: "Произошла непредвиденная ошибка, попробуйте еще раз", flags: 64 })
        }

        if (entry!.active_ticket == true) {
            return await interaction.reply({ content: "Нельзя создавать сразу несколько тикетов!", flags: 64 })
        }
        
        //@ts-ignore
        const role = await interaction.guild!.roles.fetch(config.roles[type])
        if (!role) return

        const buttons = {
            "buy_close": ["Закрыть тикет", ButtonStyle.Danger, 1],
        } 

        const row = createButtons(Object.keys(buttons) ,buttons)

        const channel = interaction.guild!.channels.cache.get(String(interaction.channel!.id)) as TextChannel;

        const ticket = await interaction.guild!.channels.create({ 
            name: `Покупатель ${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: channel.parent!.id,
            permissionOverwrites: [
                {
                    id: role.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles]
                },
                {
                    id: String(interaction.guild!.id),
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id:  interaction.user.id!,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles,  PermissionFlagsBits.ReadMessageHistory]
                },
            ]
        });

        entry.active_ticket = true
        entry.ticket_id = ticket.id
        await entry!.save()
        const message = await ticket.send({ content: `<@&${role.id}>, ${interaction.user}`, embeds: [{
            "description": "・ ** Хотим напомнить, что в чате не рекомендуется задавать [мета-вопросы](https://nometa.xyz/ru.html). \n・ Благодаря этому обслуживание будет быстрее и приятнее **\n\nС уважением, **KAZAMI** <:kazami:1247800883912245272>",
            "fields": [],
            "title": "Дорогие клиенты и покупатели!",
            "color": 10535045,
            "image": {
                "url": "https://cdn.discordapp.com/attachments/847745581329940481/1094248142741979186/image.png?ex=66625e3f&is=66610cbf&hm=0917c3b806d924c86404ab5fffb0cd6488739f95b394f62f8fe5a9783b298943&"
            }
        },
        {
            "description": "### Опишите пожалуйста тонкости товара или услуги, наша команда ответит вам в ближайшее время <:kazami:1247800883912245272>\n\n### С примерами можно ознакомиться ниже:\n<#1194041777414488204> - <:nitro:1247791703679565824> `нитро` и подписки\n<#1247514887731544106> - <:designer:1247791695152812154> `дизайн` паки серверов\n<#1247518170973999125> - <:designer:1247791695152812154> `дизайн` профилей\n<#1247518273449361488> - <:designer:1247791695152812154> `дизайн` анимации\n<#1248266505913766090> -  <:education:1247791706607456289> `сервер` паки\n<#1248273243845169314> - <:developer:1247791698663313429> `девелопер` боты и программы\n<#1248266773602500679> - <:education:1247791706607456289> `сервер` материалы\n<#1248270497867628606> - <:education:1247791706607456289> `сервер` стафф обучение\n",
            "fields": [],
            "color": 10535045,
            "image": {
            "url": "https://cdn.discordapp.com/attachments/847745581329940481/1094248142741979186/image.png?ex=66625e3f&is=66610cbf&hm=0917c3b806d924c86404ab5fffb0cd6488739f95b394f62f8fe5a9783b298943&"
        }
        }], components: row })
        await ticket.messages.pin(message)
        return await interaction.editReply({ content: `Тикет создан! Вы можете задать все интересующие вас вопросы в ${ticket}`})
    }

    async buy_close(interaction: ButtonInteraction) {
        const entry = await UserModel.findOne({ ticket_id: interaction.channel!.id }).exec()

        if (!entry) {
            return await interaction.reply({ content: "Произошла непредвиденная ошибка, попробуйте еще раз", flags: 64 })
        }

        const roles = (await interaction.guild!.members.fetch(interaction.user.id)).roles.cache
        
        const hasrole = roles.filter(role => config.approved_roles.includes(role.id))
        if (hasrole.size > 0) {
            const modal = new ModalBuilder()
                .setTitle('Kazami DEV')
                .setCustomId("kazamiDEVModal")
                .addComponents([
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                    new TextInputBuilder()
                        .setCustomId('product_name')
                        .setStyle(TextInputStyle.Short)
                        .setLabel("Название товара/услуги")
                        .setPlaceholder('Например: нитро')
                        .setRequired(true),
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                    new TextInputBuilder()
                        .setCustomId('product_price')
                        .setStyle(TextInputStyle.Short)
                        .setLabel("Конечная стоимость товара/услуги")
                        .setPlaceholder('Например: 1000р')
                        .setRequired(true),
                    ),
                ]);

            await interaction.showModal(modal)
        } else {
            const feedbackButton = new ButtonBuilder()
                .setLabel("Оставить отзыв")
                .setStyle(ButtonStyle.Link)
                .setURL(`https://discord.com/channels/${interaction.guild!.id}/${config.feedback_channel}`)
    
            const row = [new ActionRowBuilder<ButtonBuilder>().addComponents(feedbackButton)]
    
            entry.active_ticket = false
            await entry.save()
            const dm = await interaction.guild?.members.cache.get(entry._id)!.createDM() as DMChannel
            dm.send({ content: `Не забудьте оставить отзыв о проделанной работе!`, components: row })
            return await interaction.channel?.delete()
        }

    }

    async close(interaction: ButtonInteraction) {
        const entry = await UserModel.findOne({ ticket_id: interaction.channel!.id }).exec()

        if (!entry) {
            return await interaction.reply({ content: "Произошла непредвиденная ошибка, попробуйте еще раз", flags: 64 })
        }

        entry.active_ticket = false
        await entry.save()
        return await interaction.channel?.delete()
    }

    async teh(interaction: StringSelectMenuInteraction) {
        let entry = await UserModel.findOne({ _id: String(interaction.user.id!) }).exec()
        
        if (!interaction.guild) return;
        if (!entry) {
            const db = new UserModel({
                _id: interaction.user.id
            })

            await db.save()
        }


        entry = await UserModel.findOne({ _id: String(interaction.user.id) }).exec()

        if (!entry) {
            return await interaction.reply({ content: "Произошла непредвиденная ошибка, попробуйте еще раз", flags: 64 })
        }

        if (entry!.active_ticket == true) {
            return await interaction.reply({ content: "Нельзя создавать сразу несколько тикетов!", flags: 64 })
        }


        const buttons = {
            "close": ["Закрыть тикет", ButtonStyle.Danger, 1],
        } 

        const row = createButtons(Object.keys(buttons) ,buttons)

        const channel = await interaction.guild!.channels.fetch(String(interaction.channel!.id)) as unknown as TextChannel;
        
        const ticket = await interaction.guild!.channels.create({
            name: `Помощь ${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: channel.parent!.id,
            permissionOverwrites: [
                {
                    id: config.manager_role,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles]
                },
                {
                    id: String(interaction.guild!.id),
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id:  interaction.user.id!,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory]
                },
            ]
          });

        entry.active_ticket = true
        entry.ticket_id = ticket.id
        await entry!.save()
        const message = await ticket.send({ content: `<@&${config.manager_role}>`, components: row })
        await ticket.messages.pin(message)
        return await interaction.reply({ content: `Тикет создан! Вы можете задать все интересующие вас вопросы в ${ticket}`, flags: 64 })
    }

    async giveaway(interaction: StringSelectMenuInteraction) {
        let entry = await UserModel.findOne({ _id: String(interaction.user.id!) }).exec()
        
        if (!entry) {
            const db = new UserModel({
                _id: interaction.user.id
            })

            await db.save()
        }

        entry = await UserModel.findOne({ _id: String(interaction.user.id) }).exec()

        if (!entry) {
            return await interaction.reply({ content: "Произошла непредвиденная ошибка, попробуйте еще раз", flags: 64 })
        }

        if (entry!.active_ticket == true) {
            return await interaction.reply({ content: "Нельзя создавать сразу несколько тикетов!", flags: 64 })
        }

        const buttons = {
            "close": ["Закрыть тикет", ButtonStyle.Danger, 1],
        } 

        const row = createButtons(Object.keys(buttons) ,buttons)

        const channel = interaction.guild!.channels.cache.get(String(interaction.channel!.id)) as TextChannel;

        const ticket = await interaction.guild!.channels.create({ 
            name: `Победитель ${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: channel.parent!.id,
            permissionOverwrites: [
                {
                    id: config.manager_role,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles]
                },
                {
                    id: String(interaction.guild!.id),
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id:  interaction.user.id!,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory]
                },
            ]
        });

        entry.active_ticket = true
        entry.ticket_id = ticket.id
        await entry!.save()
        const message = await ticket.send({ content: `<@&${config.manager_role}>`, components: row })
        await ticket.messages.pin(message)
        return await interaction.reply({ content: `Тикет создан! Вы можете задать все интересующие вас вопросы в ${ticket}`, flags: 64 })
    }
}
