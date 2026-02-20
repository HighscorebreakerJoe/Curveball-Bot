import {Guild} from "discord.js";
import {client} from "../client";
import env from "../env";

let guild: Guild | null = null;

export async function loadGuild() {
    guild = client.guilds.cache.get(env.GUILD_ID) ?? await client.guilds.fetch(env.GUILD_ID);

    if(!guild) {
        throw new Error("Guild ist ungültig. Sage dem Admin Bescheid!");
    }

    console.log("Set up guild cache.");
}

export function getGuild(): Guild {
    if(!guild){
        throw new Error("Guild wurde noch nicht geladen.");
    }

    return guild;
}