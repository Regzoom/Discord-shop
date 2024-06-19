import { GuildMember, PermissionFlagsBits, Role } from "discord.js";
import { BotEvent } from "../types";
import * as config from "../config";

const event: BotEvent = {
    name: "guildMemberAdd",
    once: false,
    execute: async (member: GuildMember) => {
        const role = await member.guild.roles.fetch(config.roles["member"]) as Role;
        await member.roles.add(role);
    }
};

export default event;
