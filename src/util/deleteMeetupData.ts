import { getMeetupInfoChannel } from "../cache/meetupChannels";
import {
    deleteMeetupsByMeetupIDs,
    getMeetupsByMeetupIDs,
    MeetupRow,
} from "../database/table/Meetup";
import { delay } from "./delay";
import { resetMeetupListChannel } from "./resetMeetupListChannel";
import { splitArray } from "./splitArray";

type DeleteData = {
    lessThanTwoWeeks: MeetupRow[];
    moreThanTwoWeeks: MeetupRow[];
};

/**
 * Function for deleting meetup-channels and data
 */
export async function deleteMeetupData(meetupIDs: number[]): Promise<void> {
    // Discord allows bulk deleting up to 100 messages which are not older than 14 days old
    // -> split up messages into two categories

    const deleteStruct: DeleteData = {
        lessThanTwoWeeks: [],
        moreThanTwoWeeks: [],
    };

    const toDeleteMeetups: MeetupRow[] = await getMeetupsByMeetupIDs(meetupIDs);

    const dateNow = new Date();
    const twoWeeksAgo = new Date(dateNow);
    twoWeeksAgo.setDate(dateNow.getDate() - 14);

    for (const toDeleteMeetup of toDeleteMeetups) {
        sortInDeleteStruct(deleteStruct, toDeleteMeetup, twoWeeksAgo);
    }

    if (deleteStruct.lessThanTwoWeeks.length > 0) {
        await deleteBulk(deleteStruct.lessThanTwoWeeks);
    }

    if (deleteStruct.moreThanTwoWeeks.length > 0) {
        await deleteManually(deleteStruct.moreThanTwoWeeks);
    }

    //reset meetup list channel
    await resetMeetupListChannel();
}

async function deleteBulk(meetups: MeetupRow[]) {
    //split message IDs in chunks
    const messageIDs: string[] = meetups
        .map((meetup: MeetupRow) => meetup.messageID)
        .filter((messageID): messageID is string => !!messageID);

    const messageIDChunks: string[][] = splitArray(messageIDs, 100);

    const deletedMessageIDs = new Set<string>();

    // bulk delete all message chunks
    for (const messageIDChunk of messageIDChunks) {
        const deleted = await getMeetupInfoChannel().bulkDelete(messageIDChunk, true);
        for (const messageID of deleted.keys()) {
            deletedMessageIDs.add(messageID);
        }

        await delay(500);
    }

    //delete meetups
    const toDeleteMeetupIDs: number[] = meetups
        .filter((meetup: MeetupRow) => meetup.messageID && deletedMessageIDs.has(meetup.messageID))
        .map((meetup: MeetupRow) => meetup.meetupID);

    await deleteMeetupsByMeetupIDs(toDeleteMeetupIDs);
}

async function deleteManually(meetups: MeetupRow[]) {
    //get messages
    const messageIDs: string[] = meetups
        .map((meetup: MeetupRow) => meetup.messageID)
        .filter((messageID): messageID is string => !!messageID);

    const toDeleteMessages = [];
    const failedMessageIDs = new Set<string>();

    for (const messageID of messageIDs) {
        const message = await getMeetupInfoChannel()
            .messages.fetch(messageID)
            .catch(() => {
                failedMessageIDs.add(messageID);
                return null;
            });

        if (!message) {
            continue;
        }

        if (message) {
            toDeleteMessages.push(message);
        }
    }

    // delete messages one by one without reaching rate limit
    for (const toDeleteMessage of toDeleteMessages) {
        await toDeleteMessage.delete().catch(() => {
            failedMessageIDs.add(toDeleteMessage.id);
            return null;
        });

        await delay(500);
    }

    //delete meetups
    const toDeleteMeetupIDs: number[] = meetups
        .filter((meetup: MeetupRow) => meetup.messageID && !failedMessageIDs.has(meetup.messageID))
        .map((meetup: MeetupRow) => meetup.meetupID);

    await deleteMeetupsByMeetupIDs(toDeleteMeetupIDs);
}

function sortInDeleteStruct(
    deleteStruct: DeleteData,
    toDeleteMeetup: MeetupRow,
    limitDate: Date,
): void {
    const isLessThanTwoWeeks: boolean = !!(
        toDeleteMeetup.createTime && toDeleteMeetup.createTime > limitDate
    );

    if (isLessThanTwoWeeks) {
        deleteStruct.lessThanTwoWeeks.push(toDeleteMeetup);
    } else {
        deleteStruct.moreThanTwoWeeks.push(toDeleteMeetup);
    }
}
