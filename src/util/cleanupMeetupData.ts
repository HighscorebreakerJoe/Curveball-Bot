import {getMeetupInfoChannel} from "../cache/meetupChannels";
import {db} from "../database/Database";
import {MeetupRow} from "../database/table/Meetup";
import env from "../env";
import {deleteMeetupData} from "./deleteMeetupData";

/**
 * Cleans up meetup-data and -channels. Used by cleanup-cronjob and command.
 */
export async function cleanupMeetupData(): Promise<void> {
    await deleteOldMeetups();
    await deleteInvalidMeetupMessages();
}

async function deleteOldMeetups(): Promise<void> {
    //detect old meetups
    const dateNow = new Date();
    const deleteLimitHours: number = 3600000 * env.MEETUP_DELETE_LIMIT_HOURS;
    const deleteLimitDate = new Date(dateNow.getTime() - deleteLimitHours);

    const toDeleteMeetups = await db.selectFrom("meetup")
        .selectAll()
        .where("time", "<", deleteLimitDate)
        .execute() as MeetupRow[];

    const meetupIDs = [];

    for (const toDeleteMeetup of toDeleteMeetups){
        meetupIDs.push(toDeleteMeetup.meetupID);
    }

    //delete old meetups
    if(meetupIDs.length > 0){
        await deleteMeetupData(meetupIDs);
    }
}

async function deleteInvalidMeetupMessages(): Promise<void> {
    //detect invalid meetup messages (message which do not refer to a valid meetup)
    const validMessages: {messageID: string | null}[] = await db.selectFrom("meetup")
    .select("messageID")
    .execute();

    const validMessageIDs: string[] = validMessages.map(message => message.messageID)
        .filter((messageID) => messageID !== null);

    const validMessageIDsSet = new Set(validMessageIDs);

    if(validMessageIDsSet.size === 0){
        return;
    }

    const meetupChannelMessages = await getMeetupInfoChannel()
        .messages.fetch({ limit: 100 });

    const toDeleteMessages = meetupChannelMessages.filter(
        message => !validMessageIDsSet.has(message.id)
    );

    //delete invalid meetup messages
    if(toDeleteMessages.size){
        await getMeetupInfoChannel().bulkDelete(toDeleteMessages, true);
    }
}