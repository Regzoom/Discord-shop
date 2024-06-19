import chalk from "chalk"
import { ActionRowBuilder, ButtonBuilder, GuildMember, PermissionFlagsBits, PermissionResolvable, PermissionsBitField, TextChannel } from "discord.js"

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export function checkForNumbers(input: string) {
    if (/^\d+$/.test(input)) return true;
    else return false;
}

export const createButtons = (keys: any, config: any) => {
  const rows: any = [];
  let currentRow: ButtonBuilder[] = [];

  keys.forEach((key: any) => {
      const [text, style, row] = config[key];
      const customId = key;
      const button = new ButtonBuilder()
          .setCustomId(customId)
          .setLabel(text)
          .setStyle(style);
      
      if (currentRow.length < 5 && row === rows.length + 1) {
          currentRow.push(button);
      } else {
          rows.push(new ActionRowBuilder().addComponents(currentRow));
          currentRow = [button];
      }
  });

  if (currentRow.length > 0) {
      rows.push(new ActionRowBuilder().addComponents(currentRow));
  }

  return rows;
};