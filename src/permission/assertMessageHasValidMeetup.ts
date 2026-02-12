import {getMeetupByMessageID, MeetupRow} from "../database/table/Meetup";

/**
 * Checks if message with given messageID corresponds to a valid meetup
 */

export async function assertMessageHasValidMeetup(messageID: string): Promise<MeetupRow> {
    const meetup = await getMeetupByMessageID(messageID);

    if(!meetup){
        throw new Error(`Der Nachricht mit der ID ${messageID} wurde kein gültiges Meetup zugeordnet.`);
    }

    return meetup;
}