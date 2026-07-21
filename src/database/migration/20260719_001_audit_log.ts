import { ColumnDefinitionBuilder, Kysely, sql } from "kysely";
import { Database } from "../Database";

export async function up(db: Kysely<Database>): Promise<void> {
    await createAuditLogTable(db);
}

export async function down(db: Kysely<Database>): Promise<void> {
    await dropAuditLogTable(db);
}

// === up ===

function createAuditLogTable(db: Kysely<Database>): Promise<void> {
    return db.schema
        .createTable("audit_log")
        .addColumn(
            "auditLogID",
            "integer",
            (col: ColumnDefinitionBuilder): ColumnDefinitionBuilder => col.autoIncrement().primaryKey(),
        )
        .addColumn(
            "action",
            "smallint",
            (col: ColumnDefinitionBuilder): ColumnDefinitionBuilder => col.notNull(),
        )
        .addColumn(
            "userID",
            "varchar(32)",
        )
        .addColumn(
            "meetupID",
            "integer",
        )
        .addColumn(
            "additionalInformation",
            "text",
        )
        .addColumn(
            "createTime",
            "timestamp",
            (col: ColumnDefinitionBuilder): ColumnDefinitionBuilder =>
                col.defaultTo(sql`CURRENT_TIMESTAMP`),
        )        
        .execute();
}

// === down ===

function dropAuditLogTable(db: Kysely<Database>): Promise<void> {
    return db.schema.dropTable("audit_log").execute();
}
