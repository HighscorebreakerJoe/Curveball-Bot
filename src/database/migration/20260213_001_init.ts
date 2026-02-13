import {Kysely, sql} from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await createMeetupTable(db);
    await createMeetupParticipantTable(db);
    await createAllowedMentionsRoleTable(db);
    await addForeignKeys(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await removeForeignKeys(db);
    await dropAllowedMentionsRoleTable(db);
    await dropMeetupParticipantTable(db);
    await dropMeetupTable(db);
}

// === up ===

function createMeetupTable(db: Kysely<any>): Promise<void> {
    return db.schema
        .createTable("meetup")
        .addColumn("meetupID", "integer", col => 
            col.notNull()
                .autoIncrement()
                .primaryKey()
        )
        .addColumn("pokemon", "varchar(255)", col =>
            col.notNull()
        )
        .addColumn("location", "varchar(255)", col =>
            col.notNull()
        )
        .addColumn("note", sql`MEDIUMTEXT`)
        .addColumn("time", "datetime", col =>
            col.notNull()
        )
        .addColumn("userID", "varchar(32)", col =>
            col.notNull()
        )
        .addColumn("messageID", "varchar(32)")
        .addColumn("threadID", "varchar(32)")
        .addColumn("participantListMessageID", "varchar(32)")
        .addColumn("createTime", "timestamp", col =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`)
        )
        .addColumn("lastUpdateTime", "timestamp", col =>
            //see: https://github.com/kysely-org/kysely/issues/1163
            col.modifyEnd(sql`ON UPDATE CURRENT_TIMESTAMP`)
        )
        .execute();
}

function createMeetupParticipantTable(db: Kysely<any>): Promise<void> {
    return db.schema
        .createTable("meetup_participant")
        .addColumn("meetupID", "integer", col =>
            col.notNull()
        )
        .addColumn("userID", "varchar(32)", col =>
            col.notNull()
        )
        .addColumn("participants", "boolean", col =>
            col.notNull()
                .defaultTo(false)
        )
        .addColumn("unsure", "boolean", col =>
            col.notNull()
                .defaultTo(false)
        )
        .addColumn("remote", "boolean", col =>
            col.notNull()
                .defaultTo(false)
        )
        .addColumn("createTime", "timestamp", col =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`)
        )
        .addUniqueConstraint("uq_meetup_user", ["meetupID", "userID"])
        .execute();
}

function createAllowedMentionsRoleTable(db: Kysely<any>): Promise<void> {
    return db.schema
        .createTable("meetup_allowed_mentions_role")
        .addColumn("roleID", "varchar(255)", col =>
            col.notNull()
        )
        .addColumn("userID", "varchar(32)", col =>
            col.notNull()
        )
        .addColumn("createTime", "timestamp", col =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`)
        )
        .addUniqueConstraint("uq_role", ["roleID"])
        .execute();
}

function addForeignKeys(db: Kysely<any>): Promise<void> {
    return db.schema
        .alterTable("meetup_participant")
        .addForeignKeyConstraint(
            "fk_meetup_participant_meetup",
            ["meetupID"],
            "meetup",
            ["meetupID"],
            fk => fk.onDelete("cascade")
        )
        .execute();
}

// === down ===

function removeForeignKeys(db: Kysely<any>): Promise<void> {
    return db.schema
        .alterTable("meetup_participant")
        .dropConstraint(
            "fk_meetup_participant_meetup"
        )
        .execute();
}

function dropAllowedMentionsRoleTable(db: Kysely<any>): Promise<void> {
    return db.schema
        .dropTable("meetup_allowed_mentions_role")
        .execute();
}

function dropMeetupParticipantTable(db: Kysely<any>): Promise<void> {
    return db.schema
        .dropTable("meetup_participant")
        .execute();
}

function dropMeetupTable(db: Kysely<any>): Promise<void> {
    return db.schema
        .dropTable("meetup")
        .execute();
}