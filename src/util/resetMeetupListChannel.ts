import {getMeetupListChannel} from "../cache/meetupChannels";
import {generateMeetupListMessage} from "./generareMeetupListMessage";
import {sendChunkedMessages} from "./sendChunkedMessages";

/**
 * Generates message listing all currently available meetups from now on
 */
export async function resetMeetupListChannel(): Promise<void> {
    //clear meetup list channel
    const messages = await getMeetupListChannel().messages.fetch({ limit: 100 });
    await getMeetupListChannel().bulkDelete(messages);

    //post new list
    const meetupListMessage: string = await generateMeetupListMessage();
    if(meetupListMessage.length > 0){
        await sendChunkedMessages(meetupListMessage, getMeetupListChannel());
    }
}