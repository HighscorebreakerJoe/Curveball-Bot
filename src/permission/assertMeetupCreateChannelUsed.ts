import { ChatInputCommandInteraction } from "discord.js";
import env from "../env";
import { tPermission } from "../i18n";

/**
 * Checks if interaction is executed in meetup create channel
 */

export function assertMeetupCreateChannelUsed(interaction: ChatInputCommandInteraction): void {
    if (interaction?.channel?.id !== env.MEETUP_CREATE_CHANNEL_ID) {
        throw new Error(
            tPermission("error.notMeetupCreateChannel", {
                channelID: env.MEETUP_CREATE_CHANNEL_ID,
            }),
        );
    }
}
