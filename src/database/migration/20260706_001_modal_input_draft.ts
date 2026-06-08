import { ColumnDefinitionBuilder, Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await createModalInputDraftTable(db);
}

export async function down(db: Kysely<any>): Promise<void> {
    await dropModalInputDraftTable(db);
}

// === up ===

function createModalInputDraftTable(db: Kysely<any>): Promise<void> {
    return db.schema
        .createTable("modal_input_draft")
        .addColumn(
            "userID",
            "varchar(32)",
            (col: ColumnDefinitionBuilder): ColumnDefinitionBuilder => col.notNull(),
        )
        .addColumn(
            "modalCustomID",
            "varchar(100)",
            (col: ColumnDefinitionBuilder): ColumnDefinitionBuilder => col.notNull(),
        )
        .addColumn(
            "formData",
            "json",
            (col: ColumnDefinitionBuilder): ColumnDefinitionBuilder => col.notNull(),
        )
        .addColumn(
            "createTime",
            "timestamp",
            (col: ColumnDefinitionBuilder): ColumnDefinitionBuilder =>
                col.defaultTo(sql`CURRENT_TIMESTAMP`),
        )
        .addPrimaryKeyConstraint("modal_input_draft_pk",
            [
                "userID",
                "modalCustomID",
            ]
        )
        .execute();
}

// === down ===

function dropModalInputDraftTable(db: Kysely<any>): Promise<void> {
    return db.schema.dropTable("modal_input_draft").execute();
}
