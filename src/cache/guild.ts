import {Guild} from "discord.js";
import {client} from "../client";
import env from "../env";
import {tSetup} from "../i18n";

let guild: Guild | null = null;

export async function loadGuild() {
    guild = client.guilds.cache.get(env.GUILD_ID) ?? await client.guilds.fetch(env.GUILD_ID);

    if(!guild) {
        throw new Error(tSetup("error.invalidGuild"));
    }

    console.log(tSetup("step.setupGuildCache"));
}

export function getGuild(): Guild {
    if(!guild){
        throw new Error(tSetup("error.guildNotLoaded"));
    }

    return guild;
}