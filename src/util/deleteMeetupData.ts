import {getMeetupInfoChannel} from "../cache/meetupChannels";
import {db} from "../database/Database";
import {getMeetupsByMeetupIDs, MeetupRow} from "../database/table/Meetup";
import {resetMeetupListChannel} from "./resetMeetupListChannel";

/**
 * Function for deleting meetup-channels and data
 */
export async function deleteMeetupData(meetupIDs: number[]): Promise<void> {
    const toDeleteMeetupIDs: number[] = [];
    const toDeleteMessageIDs: string[] = [];

    const toDeleteMeetups: MeetupRow[] = await getMeetupsByMeetupIDs(meetupIDs);

    for (const toDeleteMeetup of toDeleteMeetups){
        if(toDeleteMeetup.meetupID && toDeleteMeetup.messageID){
            toDeleteMeetupIDs.push(toDeleteMeetup.meetupID);
            toDeleteMessageIDs.push(toDeleteMeetup.messageID);
        }
    }

    if(toDeleteMeetupIDs.length == 0){
        return;
    }

    //delete meetups
    await db
        .deleteFrom("meetup")
        .where("meetupID", "in", toDeleteMeetupIDs)
        .execute();

    //delete messages
    const toDeleteMessages = [];
    const toDeleteThreads = [];

    for (const messageID of toDeleteMessageIDs){
        if(messageID !== null) {
            const message = await getMeetupInfoChannel().messages.fetch(messageID);
            toDeleteMessages.push(message);

            const thread = message.thread;
            toDeleteThreads.push(thread);
        }
    }

    if (toDeleteMessages.length > 0) {
        await getMeetupInfoChannel().bulkDelete(toDeleteMessages, true);
    }

    if(toDeleteThreads.length > 0){
        //TODO: Bulk delete if possible?
        for(const thread of toDeleteThreads){
            thread?.delete();
        }
    }

    //reset meetup list channel
    await resetMeetupListChannel();
}