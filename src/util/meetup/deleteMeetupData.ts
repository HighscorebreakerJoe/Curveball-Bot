import { getGuild } from "../../cache/guild";
import { getMeetupInfoChannel } from "../../cache/meetupChannels";
import {
    deleteMeetupsByMeetupIDs,
    getMeetupsByMeetupIDs,
    MeetupRow,
} from "../../database/table/Meetup";
import { tCommon, tMeetup } from "../../i18n";
import { delay } from "../delay";
import { splitArray } from "../splitArray";
import { scheduleMeetupListReset } from "./scheduleMeetupListReset";

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

    const results = [];

    if (deleteStruct.lessThanTwoWeeks.length > 0) {
        results.push(await deleteMessagesBulk(deleteStruct.lessThanTwoWeeks));
    }

    if (deleteStruct.moreThanTwoWeeks.length > 0) {
        results.push(await deleteMessagesManually(deleteStruct.moreThanTwoWeeks));
    }

    const combinedMeetupIDs: number[] = results.flatMap((r) => r.toDeleteMeetupIDs);
    const combinedRoleIDs: string[] = results.flatMap((r) => r.toDeleteRoleIDs);

    if (combinedMeetupIDs.length) {
        await deleteMeetupsByMeetupIDs(combinedMeetupIDs);
    }

    if (combinedRoleIDs.length) {
        await deleteRoleByRoleIDs(combinedRoleIDs);
    }

    //schedule meetup list channel reset
    scheduleMeetupListReset();
}

async function deleteMessagesBulk(meetups: MeetupRow[]) {
    //split message IDs in chunks
    const messageIDs: Set<string> = new Set(
        meetups
            .map((meetup: MeetupRow) => meetup.messageID)
            .filter((messageID): messageID is string => !!messageID),
    );

    const messageIDChunks: string[][] = splitArray([...messageIDs], 100);

    const deletedMessageIDs = new Set<string>();

    // bulk delete all message chunks
    for (const messageIDChunk of messageIDChunks) {
        const deleted = await getMeetupInfoChannel().bulkDelete(messageIDChunk, true);
        for (const messageID of deleted.keys()) {
            deletedMessageIDs.add(messageID);
        }

        await delay(500);
    }

    const excludeMessageIDs = new Set<string>();

    for (const id of messageIDs) {
        if (!deletedMessageIDs.has(id)) {
            excludeMessageIDs.add(id);
        }
    }

    return createToDeleteSummary(meetups, excludeMessageIDs);
}

async function deleteMessagesManually(meetups: MeetupRow[]) {
    //get messages
    const messageIDs: Set<string> = new Set(
        meetups
            .map((meetup: MeetupRow) => meetup.messageID)
            .filter((messageID): messageID is string => !!messageID),
    );

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

    return createToDeleteSummary(meetups, failedMessageIDs);
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

function createToDeleteSummary(meetups: MeetupRow[], excludeMessageIDs: Set<string>) {
    const toDeleteMeetupIDs: number[] = [];
    const toDeleteRoleIDs: string[] = [];

    for (const meetup of meetups) {
        if (!meetup.messageID || excludeMessageIDs.has(meetup.messageID)) {
            continue;
        }

        toDeleteMeetupIDs.push(meetup.meetupID);

        if (meetup.mentionRoleID) {
            toDeleteRoleIDs.push(meetup.mentionRoleID);
        }
    }

    return {
        toDeleteMeetupIDs: toDeleteMeetupIDs,
        toDeleteRoleIDs: toDeleteRoleIDs,
    };
}

async function deleteRoleByRoleIDs(roleIDs: string[]) {
    for (const roleID of roleIDs) {
        try {
            await getGuild().roles.delete(roleID, tCommon("defaultDeleteReason"));
            await delay(500);
        } catch (error) {
            console.error(tMeetup("role.error.delete", { roleID: roleID }), error);
        }
    }
}
