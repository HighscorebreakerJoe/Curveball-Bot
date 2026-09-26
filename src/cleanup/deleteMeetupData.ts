import { DiscordAPIError, Message } from "discord.js";
import { getMeetupInfoChannel } from "../cache/meetupChannels";
import { AuditLogAction } from "../constant/auditLogAction";
import { createAuditLog } from "../database/table/AuditLog";
import {
    deleteMeetupsByMeetupIDs,
    getMeetupsByMeetupIDs,
    MeetupRow,
} from "../database/table/Meetup";
import { tMeetup } from "../i18n";
import { delay } from "../util/delay";
import { splitArray } from "../util/splitArray";
import { deleteRoleByRoleIDs } from "./deleteRoleByRoleIDs";
import { logger } from "../logger";

type CategorizedMessageIDs = {
    lessThanTwoWeeks: string[];
    moreThanTwoWeeks: string[];
};

/**
 * Function for deleting meetup-channels and data
 */
export async function deleteMeetupData(
    meetupIDs: number[],
    automaticallyDeleted: boolean = false,
    userID?: string,
): Promise<void> {
    const toDeleteMeetups: MeetupRow[] = await getMeetupsByMeetupIDs(meetupIDs);

    const categorizedMessageIDs: CategorizedMessageIDs = getMessageIDsFromMeetups(toDeleteMeetups);
    const roleIDs: string[] = toDeleteMeetups
        .map((meetup): string | null => meetup.mentionRoleID)
        .filter((roleID: string | null): roleID is string => Boolean(roleID));

    await Promise.allSettled([deleteMessages(categorizedMessageIDs), deleteRoleByRoleIDs(roleIDs)]);

    await deleteMeetupsByMeetupIDs(meetupIDs);

    // Use stable values instead of translated strings. Audit logs should not depend on the active locale
    const additionalInformation: string = JSON.stringify({
        reason: automaticallyDeleted ? "Deleted automatically" : undefined,
    });

    for (const meetupID of meetupIDs) {
        await createAuditLog(AuditLogAction.MEETUP_DELETE, {
            userID: userID,
            meetupID: meetupID,
            additionalInformation: additionalInformation,
        });
    }
}

function getMessageIDsFromMeetups(meetups: MeetupRow[]): CategorizedMessageIDs {
    // Discord allows bulk deleting up to 100 messages which are not older than 14 days old
    // -> split up messages into two categories

    const categorizedMessageIDs: CategorizedMessageIDs = {
        lessThanTwoWeeks: [],
        moreThanTwoWeeks: [],
    };

    const dateNow = new Date();
    const twoWeeksAgo = new Date(dateNow);
    twoWeeksAgo.setDate(dateNow.getDate() - 14);

    for (const toDeleteMeetup of meetups) {
        setMessageIDCategory(categorizedMessageIDs, toDeleteMeetup, twoWeeksAgo);
    }

    return categorizedMessageIDs;
}

async function deleteMessages(categorizedMessageIDs: CategorizedMessageIDs): Promise<void> {
    if (categorizedMessageIDs.lessThanTwoWeeks.length > 0) {
        await deleteMessagesBulk(categorizedMessageIDs.lessThanTwoWeeks);
    }

    if (categorizedMessageIDs.moreThanTwoWeeks.length > 0) {
        await deleteMessagesManually(categorizedMessageIDs.moreThanTwoWeeks);
    }
}

async function deleteMessagesBulk(messageIDs: string[]): Promise<void> {
    //split message IDs in chunks
    const messageIDChunks: string[][] = splitArray([...messageIDs], 100);

    // bulk delete all message chunks
    for (const messageIDChunk of messageIDChunks) {
        try {
            await getMeetupInfoChannel().bulkDelete(messageIDChunk, true);
            await delay(500);
        } catch (error: unknown) {
            if (error instanceof DiscordAPIError && error.code === 10008) {
                continue;
            }

            logger.error({ err: error }, tMeetup("message.error.delete", { messageID: "0" }));
        }
    }
}

async function deleteMessagesManually(messageIDs: string[]): Promise<void> {
    for (const messageID of messageIDs) {
        try {
            const message: Message<true> = await getMeetupInfoChannel().messages.fetch(messageID);
            await message.delete();

            await delay(500);
        } catch (error: unknown) {
            if (error instanceof DiscordAPIError && error.code === 10008) {
                continue;
            }

            logger.error({ err: error }, tMeetup("message.error.delete", { messageID: messageID }));
        }
    }
}

function setMessageIDCategory(
    categorizedMessageIDs: CategorizedMessageIDs,
    toDeleteMeetup: MeetupRow,
    limitDate: Date,
): void {
    const messageID: string = toDeleteMeetup.messageID ?? "";

    if (!messageID) {
        return;
    }

    const isLessThanTwoWeeks: boolean = !!(
        toDeleteMeetup.createTime && toDeleteMeetup.createTime > limitDate
    );

    if (isLessThanTwoWeeks) {
        categorizedMessageIDs.lessThanTwoWeeks.push(messageID);
    } else {
        categorizedMessageIDs.moreThanTwoWeeks.push(messageID);
    }
}
