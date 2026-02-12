import {MessageFlags, TextChannel} from "discord.js";
import {delay} from "./delay";
import {splitMessage} from "./splitMessage";

/**
 * Splits up messages as chunks and posts them in a specific channel
 */
export async function sendChunkedMessages(message: string, channel: TextChannel): Promise<void> {
    for (const chunk of splitMessage(message)) {
        await channel.send({
            content: chunk,
            flags: MessageFlags.SuppressEmbeds
        });
        await delay(500);
    }
}