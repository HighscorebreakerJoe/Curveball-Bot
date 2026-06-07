import { Message } from "discord.js";
import { getMeetupInfoChannel } from "../cache/meetupChannels";
import { getAllMeetupMessageIDs } from "../database/table/Meetup";
import { deleteMessage } from "./deleteMessage";

/**
 * Deletes messages which were used by already deleted meetups
 */

export async function deleteRedundantMeetupMessages(): Promise<void> {
    const existingMeessageIDs: Set<string> = new Set(await getAllMeetupMessageIDs());

    const messages = await getMeetupInfoChannel().messages.fetch({ limit: 100 });

    messages.forEach(
        (message: Message) => deleteValidMessage(message, existingMeessageIDs)
    )
}

async function deleteValidMessage(message: Message, existingMeessageIDs: Set<string>): Promise<void> {
    if(!existingMeessageIDs.has(message.id)) {
        await deleteMessage(message);
    }
}
