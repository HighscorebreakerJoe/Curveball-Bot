import { getMeetupByMeetupID, MeetupRow } from "../database/table/Meetup";
import { tPermission } from "../i18n";

/**
 * Checks if given meetupID is related to a valid meetup
 */

export async function assertMeetupIDIsValid(meetupID: number): Promise<MeetupRow> {
    const meetup = await getMeetupByMeetupID(meetupID);

    if (!meetup) {
        throw new Error(tPermission("error.invalidMeetup", { meetupID: meetupID }));
    }

    return meetup;
}
