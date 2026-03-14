import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await addMentionColumnInMeetupTable(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await removeMentionColumnFromMeetupTable(db);
}

// === up ===

function addMentionColumnInMeetupTable(db: Kysely<any>): Promise<void> {
    return db.schema.alterTable("meetup").addColumn("mentionRoleID", "varchar(255)").execute();
}

// === down ===

function removeMentionColumnFromMeetupTable(db: Kysely<any>): Promise<void> {
    return db.schema.alterTable("meetup_participant").dropColumn("mentionRoleID").execute();
}
