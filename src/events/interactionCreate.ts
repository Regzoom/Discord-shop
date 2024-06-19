import { Interaction } from "discord.js";
import { BotEvent } from "../types";
import Shop from "../components/buttons/shop";
import kazamiDEVModal from "../components/modals/KazamiDEVModal";
import rolesSelect from "../components/select/rolesSelect";
import TryAgain from "../components/buttons/tryagain";

const event : BotEvent = {
    name: "interactionCreate",
    execute: async (interaction: Interaction) => {
        try {
            if (interaction.isStringSelectMenu()) {
                if (interaction.customId == "product_select") {
                    switch (interaction.values[0]) {
                        case "help":
                            new Shop().teh(interaction)
                            break;
                        
                        case "get_prise":
                            new Shop().giveaway(interaction)
                            break;
                        
                        case "developer":
                            new Shop().buy(interaction, "developer")
                            break;
        
                        case "design":
                            new Shop().buy(interaction, "designer")
                            break;
                        
                        case "staff":
                            new Shop().buy(interaction, "staff")
                            break;
        
                        case "nitro":
                            new Shop().buy(interaction, "manager")
                            break;
                    }
                }
                if (interaction.customId.startsWith("roles_select")) {
                    await new rolesSelect().run(interaction)
                }
            }
            if (interaction.isButton()) {
                if (interaction.customId == "close") {
                    await new Shop().close(interaction)
                }
                
                if (interaction.customId.startsWith("tryagain")) {
                    await new TryAgain().run(interaction)
                }

                if (interaction.customId == "buy_close") {
                    await new Shop().buy_close(interaction)
                }
            }

            if (interaction.isModalSubmit()) {
                if (interaction.customId == "kazamiDEVModal") {
                    await new kazamiDEVModal().run(interaction)
                }
            }
        } catch (e) {
            console.log(e)
        }
        if (interaction.isChatInputCommand()) {
            let command = interaction.client.slashCommands.get(interaction.commandName)
            let cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`)
            if (!command) return;
            if (command.cooldown && cooldown) {
                if (Date.now() < cooldown) {
                    interaction.reply(`Вам нужно подождать ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} секунды, чтобы снова использовать эту команду.`)
                    setTimeout(() => interaction.deleteReply(), 5000)
                    return
                }
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
                setTimeout(() => {
                    interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`)
                }, command.cooldown * 1000)
            } else if (command.cooldown && !cooldown) {
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
            }
            command.execute(interaction)
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                if(!command.autocomplete) return;
                command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}

export default event;