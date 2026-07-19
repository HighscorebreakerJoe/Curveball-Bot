import { db } from "../database/Database";
import { MeetupRow } from "../database/table/Meetup";
import env from "../env";
import { deleteMeetupData } from "./deleteMeetupData";

/**
 * Function for deleting old meetups
 */

export async function deleteOldMeetups(): Promise<void> {
    //detect old meetups
    const dateNow = new Date();
    const deleteLimitHours: number = 3600000 * env.MEETUP_DELETE_LIMIT_HOURS;
    const deleteLimitDate = new Date(dateNow.getTime() - deleteLimitHours);

    const toDeleteMeetups = (await db
        .selectFrom("meetup")
        .selectAll()
        .where("time", "<", deleteLimitDate)
        .execute()) as MeetupRow[];

    const meetupIDs = [];

    for (const toDeleteMeetup of toDeleteMeetups) {
        meetupIDs.push(toDeleteMeetup.meetupID);
    }

    if (meetupIDs.length > 0) {
        //delete old meetups
        await deleteMeetupData(meetupIDs, true);
    }
}
