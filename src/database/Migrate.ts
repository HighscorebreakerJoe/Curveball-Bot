import {FileMigrationProvider, MigrationResult, Migrator} from "kysely";
import {promises as fs} from "fs";
import * as path from "path";
import {db} from "./Database";

const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(__dirname, "migration")
    })
})

export async function migrateToLatest(): Promise<void> {
    console.log("Search for new database migrations");

    const {error, results} = await migrator.migrateToLatest();

    if(error){
        console.error("Migration failed:", error);
        process.exit(1);
    }

    if(!results?.length){
        console.log("No new database migrations found");
    }

    results?.forEach((result: MigrationResult): void => {
        if(result.status === "Success"){
            console.log(`Migration "${result.migrationName}" was executed successfully`);
        } else if (result.status === "Error"){
            console.error(`Failed to execute migration "${result.migrationName}"`);
        }
    });
}