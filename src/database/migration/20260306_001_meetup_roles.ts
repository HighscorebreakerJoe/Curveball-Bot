import { Kysely } from "kysely";
import { Database } from "../Database";

export async function up(db: Kysely<Database>): Promise<void> {
    await addMentionColumnInMeetupTable(db);
}

export async function down(db: Kysely<Database>): Promise<void> {
    await removeMentionColumnFromMeetupTable(db);
}

// === up ===

function addMentionColumnInMeetupTable(db: Kysely<Database>): Promise<void> {
    return db.schema.alterTable("meetup").addColumn("mentionRoleID", "varchar(255)").execute();
}

// === down ===

function removeMentionColumnFromMeetupTable(db: Kysely<Database>): Promise<void> {
    return db.schema.alterTable("meetup_participant").dropColumn("mentionRoleID").execute();
}
