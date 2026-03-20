import { Message } from "discord.js";
import env from "../env";
import { tPermission } from "../i18n";

/**
 * Checks if message has been posted by bot
 */

export function assertMessagePostedByBot(message: Message): void {
    if (!message.author.bot || message.author.id !== env.CLIENT_ID) {
        throw new Error(tPermission("error.messageNotPostedByBot", { messageID: message.id }));
    }
}
