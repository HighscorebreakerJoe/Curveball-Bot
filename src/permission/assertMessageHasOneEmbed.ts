/**
 * Checks if message has exactly one embed
 */
import { Message } from "discord.js";
import { tPermission } from "../i18n";

export function assertMessageHasOneEmbed(message: Message): void {
    if (!message.embeds.length) {
        throw new Error(tPermission("error.messageHasNoEmbeds", { messageID: message.id }));
    }

    if (message.embeds.length > 1) {
        throw new Error(tPermission("error.messageHasMoreThanOneEmbed", { messageID: message.id }));
    }
}
