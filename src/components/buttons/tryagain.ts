import { ActionRowBuilder, ButtonInteraction, GuildMember, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import * as config from "../../config"

export default class TryAgain {
    async run(interaction: ButtonInteraction) {
    const roles = (await interaction.guild!.members.fetch(interaction.user.id)).roles.cache

    const hasrole = roles.filter(role => config.approved_roles.includes(role.id))
    if (hasrole.size == 0) return await interaction.reply({ embeds: [{ 
            title: "Ошибка",
            description: "Вы не можете нажать на эту кнопку",
            thumbnail: {
                url: interaction.user.avatarURL({ size: 512})!.toString()
            },
            color: config.errorEmbedColor
        }], ephemeral: true })
    
    const userid = interaction.customId.split("_")
    const user = await interaction.guild!.members.fetch(userid[1]) as GuildMember;
    if (!user) return await interaction.update({ embeds: [{ 
        title: "Ошибка",
        description: "Пользователь не найден",
        thumbnail: {
            url: interaction.user.avatarURL({ size: 512})!.toString()
        },
        color: config.errorEmbedColor
    }] })

    if (user.user.bot) return await interaction.update({ embeds: [{ 
        title: "Ошибка",
        description: "Пользователь не может быть ботом",
        thumbnail: {
            url: String(user.user.avatarURL({ size: 512}))
        },
        color: config.errorEmbedColor
    }] })

    const select = new StringSelectMenuBuilder()
    .setCustomId(`roles_select_${user!.id}`)
    .setPlaceholder("Выберите роль...")
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel("Покупатель 1 уровня")
            .setValue("buyer1")
            .setEmoji(config.emojis.buyer1)
            .setDescription("Выдать роль баера 1 уровня"),

        new StringSelectMenuOptionBuilder()
            .setLabel("Покупатель 2 уровня")
            .setValue("buyer2")
            .setEmoji(config.emojis.buyer2)
            .setDescription("Выдать роль баера 2 уровня"),
        
        new StringSelectMenuOptionBuilder()
            .setLabel("Покупатель 3 уровня")
            .setValue("buyer3")
            .setEmoji(config.emojis.buyer3)
            .setDescription("Выдать роль баера 1 уровня"),
    )
    const as = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)

    await interaction.update({
      embeds: [
        {
          title: `Выдать роль пользователю ${user.user.username}`,
          description: "Какую роль нужно выдать?",
          thumbnail: {
            url: user!.user.avatarURL({ size: 512 })!.toString()
          },
          color: config.embedColor,
        },
      ], components: [as]
    });
    }
}