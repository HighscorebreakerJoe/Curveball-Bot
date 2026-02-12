import {Generated} from "kysely";
import {Selectable} from "kysely/dist/esm";
import {Database} from "../Database";

export interface MeetupAllowedMentionsRole {
    roleID: string;
    userID: string;

    createTime: Generated<Date | null>;
}

export type MeetupAllowedMentionsRoleRow = Selectable<Database["meetup_allowed_mentions_role"]>;