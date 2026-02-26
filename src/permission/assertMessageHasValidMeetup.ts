import { getMeetupByMessageID, MeetupRow } from "../database/table/Meetup";
import { tPermission } from "../i18n";

/**
 * Checks if message with given messageID corresponds to a valid meetup
 */

export async function assertMessageHasValidMeetup(messageID: string): Promise<MeetupRow> {
    const meetup = await getMeetupByMessageID(messageID);

    if (!meetup) {
        throw new Error(tPermission("error.noMeetupFoundByMessage"));
    }

    return meetup;
}
