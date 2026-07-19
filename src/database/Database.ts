import { Kysely, MysqlDialect } from "kysely";
import mysql from "mysql2";
import env from "../env";
import { AuditLog } from "./table/AuditLog";
import { Meetup } from "./table/Meetup";
import { MeetupAllowedMentionsRole } from "./table/MeetupAllowedMentionsRole";
import { MeetupParticipant } from "./table/MeetupParticipant";
import { ModalInputDraft } from "./table/ModalInputDraft";

export interface Database {
    meetup: Meetup;
    meetup_participant: MeetupParticipant;
    meetup_allowed_mentions_role: MeetupAllowedMentionsRole;
    modal_input_draft: ModalInputDraft;
    audit_log: AuditLog;
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
