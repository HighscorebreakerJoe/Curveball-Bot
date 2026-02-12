import {getMeetupByMeetupID, MeetupRow} from "../database/table/Meetup";

/**
 * Checks if given meetupID is related to a valid meetup
 */

export async function assertMeetupIDIsValid(meetupID: number): Promise<MeetupRow> {
    const meetup = await getMeetupByMeetupID(meetupID);

    if(!meetup){
        throw new Error(`Kein gültiges Meetup mit der ID ${meetupID} gefunden.`);
    }

    return meetup;
}