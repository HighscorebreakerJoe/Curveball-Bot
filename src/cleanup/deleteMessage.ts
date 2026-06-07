import { Message } from "discord.js";
import { tMeetup } from "../i18n";
import { delay } from "../util/delay";

/**
 * Deletes given message
 */
export async function deleteMessage(message: Message): Promise<void> {
    try {
        await message.delete();
        await delay(500);
    } catch (error: unknown) {
        console.error(tMeetup("message.error.delete", { messageID: message.id }), error);
    }
}