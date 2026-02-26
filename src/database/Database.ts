import { Kysely, MysqlDialect } from "kysely";
import mysql from "mysql2";
import env from "../env";
import { Meetup } from "./table/Meetup";
import { MeetupAllowedMentionsRole } from "./table/MeetupAllowedMentionsRole";
import { MeetupParticipant } from "./table/MeetupParticipant";

export interface Database {
    meetup: Meetup;
    meetup_participant: MeetupParticipant;
    meetup_allowed_mentions_role: MeetupAllowedMentionsRole;
}

export const db = new Kysely<Database>({
    dialect: new MysqlDialect({
        pool: mysql.createPool({
            host: env.DB_HOST,
            user: env.DB_USERNAME,
            port: Number(env.DB_PORT),
            password: env.DB_PASSWORD,
            database: env.DB_DATABASE,
        }),
    }),
});
