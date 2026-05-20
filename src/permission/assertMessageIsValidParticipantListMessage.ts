import { getMeetupByParticipantListMessageID, MeetupRow } from "../database/table/Meetup";
import { tPermission } from "../i18n";

/**
 * Checks if message with given messageID corresponds to a valid participant list of a meetup
 */

export async function assertMessageIsValidParticipantListMessage(messageID: string): Promise<MeetupRow> {
    const meetup: MeetupRow | undefined = await getMeetupByParticipantListMessageID(messageID);

    if (!meetup) {
        throw new Error(tPermission("error.noMeetupFoundByMessage"));
    }

    return meetup;
}
