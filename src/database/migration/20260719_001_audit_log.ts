import { ColumnDefinitionBuilder, Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await createAuditLogTable(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await dropAuditLogTable(db);
}

// === up ===

function createAuditLogTable(db: Kysely<any>): Promise<void> {
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

function dropAuditLogTable(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("audit_log").execute();
}
