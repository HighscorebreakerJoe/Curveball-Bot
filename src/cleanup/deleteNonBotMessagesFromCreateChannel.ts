import { getMeetupCreateChannel } from "../cache/meetupChannels";
import env from "../env";

/**
 * Function for deleting messages from meetup create channel which were not posted by the bot
 */

export async function deleteNonBotMessagesFromCreateChannel(): Promise<void> {
    const messages = await getMeetupCreateChannel().messages.fetch({ limit: 100 });
    const filteredMessages = messages.filter(
        (message) => !message.author.bot || message.author.id !== env.CLIENT_ID,
    );

    await getMeetupCreateChannel().bulkDelete(filteredMessages);
}
