import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction, ChatInputCommandInteraction, Events, Emoji } from "discord.js"
import mongoose, { Types } from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder,
    execute: (interaction : ChatInputCommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    modal?: (interaction: ModalSubmitInteraction<CacheType>) => void,
    cooldown?: number // в секундах
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
}

export interface IUser extends mongoose.Document {
    _id: string;
    active_ticket: boolean;
    ticket_id: string;
}

export interface IProducts extends mongoose.Document {
    _id: string;
    name: string;
    url: string;
    time: Date;
}

export interface IOrder extends mongoose.Document {
    seller: string;
    name: string;
    valute: string;
    price: number;
    buyer: string;
}

export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string,
            CLIENT_ID: string,
            PREFIX: string,
            MONGODB_URI: string,
            MONGODB_NAME: string,
        }
    }
}
declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}