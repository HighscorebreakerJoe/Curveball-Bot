import {Generated} from "kysely";
import {Selectable} from "kysely/dist/esm";
import {Database} from "../Database";

export interface MeetupParticipant {
    meetupID: Generated<number>;
    userID: string;

    participants: Generated<number>;
    unsure: Generated<boolean>;
    remote: Generated<boolean>;

    createTime: Generated<Date | null>;
}

export type MeetupParticipantRow = Selectable<Database["meetup_participant"]>;