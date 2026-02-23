import {FileMigrationProvider, MigrationResult, Migrator} from "kysely";
import {promises as fs} from "fs";
import * as path from "path";
import {tSetup} from "../i18n";
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
    console.log(tSetup("step.searchForDatabaseMigrations"));

    const {error, results} = await migrator.migrateToLatest();

    if(error){
        console.error(tSetup("error.databaseMigrationFailed"), error);
        process.exit(1);
    }

    if(!results?.length){
        console.log(tSetup("step.noDatabaseMigrationsFound"));
    }

    results?.forEach((result: MigrationResult): void => {
        if(result.status === "Success"){
            console.log(tSetup("step.databaseMigrationsSuccess", {migrationName: result.migrationName}));
        } else if (result.status === "Error"){
            console.error(tSetup("error.executeDatabaseMigrationFailed", {migrationName: result.migrationName}));
        }
    });
}