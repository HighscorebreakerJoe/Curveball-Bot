import {TranslationObject} from "../../i18n";

const setup: TranslationObject = {
    client: {
        activity: "Pokémon GO",
        loginMessage: "Logged in as: {{tag}}"
    },

    step: {
        setupGuildCache: "Set up guild cache.",
        setupMentionsRolesCache: "Set up mention roles cache.",
        setupMeetupChannelCache: "Set up meetup channel cache.",
        setupHourlyCleanupCronjob: "Set up hourly cleanup cronjob.",
        searchForDatabaseMigrations: "Search for new database migrations.",
        noDatabaseMigrationsFound: "No new database migrations found.",
        databaseMigrationsSuccess: "Migration executed successfully: {{migrationName}}",
        registeredCommands: "Registered Commands.",
        complete: "Setup complete. Ready to GO!"
    },

    error : {
        loginFailed: "Login failed.",
        invalidGuild: "Invalid guild.",
        invalidInfoChannel: "Meetup info channel is invalid.",
        invalidListChannel: "Meetup list channel is invalid.",
        guildNotLoaded: "Guild is not loaded yet.",
        databaseMigrationFailed: "Migration failed:",
        executeDatabaseMigrationFailed: "Failed to execute migration: {{migrationName}}",
        registerCommands: "Error registering commands:"
    }
}

export default setup;