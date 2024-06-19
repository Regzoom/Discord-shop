import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuInteraction } from "discord.js";
import * as config from "../../config"

export default class rolesSelect {
    async run(interaction: StringSelectMenuInteraction) {
        //@ts-ignore
        const role = await interaction.guild!.roles.fetch(config.roles[interaction.values[0]])
        const user = await interaction.guild!.members.fetch((interaction.customId.split("_"))[2])

        if (!role) return await interaction.update({ embeds: [{
            title: "Ошибка",
            description: "Не получилось найти роль, попробуйте еще раз или напишите разработчику",
            thumbnail: {
                url: user!.user.avatarURL({ size: 512 })!.toString()
            },
            color: config.errorEmbedColor
        }]
    }) 

        const button = new ButtonBuilder()
            .setLabel("Попробовать еще раз")
            .setCustomId(`tryagain_${user.id}`)
            .setStyle(ButtonStyle.Primary)

        const ab = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

        if (((user.roles.cache).filter(userrole => role == userrole)).size > 0) {
            return await interaction.update({ embeds: [{
                    title: "Ошибка",
                    description: "У пользователя уже есть такая роль",
                    thumbnail: {
                        url: String(user.user.avatarURL({ size: 512}))
                    },
                    color: config.errorEmbedColor
                }], components: [ab]
            })
        }


        await user.roles.add(role!)
        await interaction.update({ embeds: [{
            title: "Роль успешно выдана",
            description: `Выдал пользователю ${user} роль ${role}`,
            thumbnail: {
                url: String(user.user.avatarURL({ size: 512 }))
            },
            color: config.embedColor,
        }],components: [] })
    }
}