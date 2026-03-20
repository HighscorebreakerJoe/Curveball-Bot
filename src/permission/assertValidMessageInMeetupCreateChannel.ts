import { Message } from "discord.js";
import { getMeetupCreateChannel } from "../cache/meetupChannels";
import { tPermission } from "../i18n";

/**
 * Checks if message with provided ID exists in meetup create channel
 */

export async function assertValidMessageInMeetupCreateChannel(messageID: string): Promise<Message> {
    const message = await getMeetupCreateChannel().messages.fetch(messageID);

    if (!message) {
        throw new Error(
            tPermission("error.invalidMessageInMeetupCreate", { messageID: messageID }),
        );
    }

    return message;
}
