import {DeleteResult, Generated, Selectable} from "kysely";
import {Database, db} from "../Database";

export interface Meetup {
    meetupID: Generated<number>;

    pokemon: string;
    location: string;
    note: Generated<string | null>;
    time: Date;
    userID: string;
    messageID: string | null;
    threadID: string | null;
    participantListMessageID: string | null;
    createTime: Generated<Date | null>;
    lastUpdateTime: Generated<Date | null>;
}

export type MeetupRow = Selectable<Database["meetup"]>;

export async function getMeetupByMeetupID(meetupID: number): Promise<MeetupRow | undefined>{
    return await db.selectFrom("meetup")
        .selectAll()
        .where("meetupID", "=", meetupID)
        .executeTakeFirst() as MeetupRow | undefined;
}

export async function getMeetupByMessageID(messageID: string): Promise<MeetupRow | undefined>{
    return await db.selectFrom("meetup")
        .selectAll()
        .where("messageID", "=", messageID)
        .executeTakeFirst() as MeetupRow | undefined;
}

export async function getMeetupsByMeetupIDs(meetupIDs: number[]): Promise<MeetupRow[]> {
    return await db.selectFrom("meetup")
        .selectAll()
        .where("meetupID", "in", meetupIDs)
        .execute() as MeetupRow[];
}

export async function deleteMeetupsByMeetupIDs(toDeleteMeetupIDs: number[]): Promise<DeleteResult[]> {
    return await db
        .deleteFrom("meetup")
        .where("meetupID", "in", toDeleteMeetupIDs)
        .execute();
}