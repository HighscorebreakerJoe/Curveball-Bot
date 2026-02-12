import {ChatInputCommandInteraction} from "discord.js";
import env from "../env";

/**
 * Checks if interaction is executed in meetup create channel
 */

export function assertMeetupCreateChannelUsed(interaction: ChatInputCommandInteraction): void {
    if(interaction?.channel?.id !== env.MEETUP_CREATE_CHANNEL_ID){
        throw new Error("Falscher Channel. Führe dieses Kommando bitte in #meetup_erstellen aus");
    }
}