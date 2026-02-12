import {Client, IntentsBitField} from "discord.js";

export const client: Client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages
    ]
});