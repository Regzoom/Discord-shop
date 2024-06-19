import { SlashCommandBuilder, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } from "discord.js";
import { SlashCommand } from "../types";
import * as config from "../config";

const manage: SlashCommand = {
  //@ts-ignore
  command: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Выдать роль пользователю.")
    .addUserOption((option) =>
      option
        .setName("пользователь")
        .setDescription("Пользователь, которому нужно выдать роль.")
        .setRequired(true)
  ),
  execute: async (interaction) => {
    const roles = (await interaction.guild!.members.fetch(interaction.user.id)).roles.cache
        
    const hasrole = roles.filter(role => config.approved_roles.includes(role.id))
    if (hasrole.size == 0) return await interaction.reply({ embeds: [{ 
      title: "Ошибка",
      description: "Вы не можете выполнять эту команду",
      thumbnail: {
        url: interaction.user.avatarURL({ size: 512})!.toString()
      },
      color: config.errorEmbedColor
     }], ephemeral: true })

    const user = interaction.options.getUser("пользователь");

    if (!user) return await interaction.reply({ embeds: [{ 
      title: "Ошибка",
      description: "Пользователь не найден",
      thumbnail: {
        url: interaction.user.avatarURL({ size: 512})!.toString()
      },
      color: config.errorEmbedColor
     }], ephemeral: true })

    if (user!.bot) return await interaction.reply({ embeds: [{ 
      title: "Ошибка",
      description: "Пользователь не может быть ботом",
      thumbnail: {
        url: user.avatarURL({ size: 512})!.toString()
      },
      color: config.errorEmbedColor
     }], ephemeral: true })

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

    await interaction.reply({
      embeds: [
        {
          title: `Выдать роль пользователю ${user?.username}`,
          description: "Какую роль нужно выдать?",
          thumbnail: {
            url: user!.avatarURL({ size: 512 })!.toString()
          },
          color: config.embedColor,
        },
      ], components: [as]
    });
  },
  cooldown: 10,
};

export default manage;
