/**
 * Base class for all commands for Curveball Bot
 */

import {
    APIApplicationCommandOption,
    ChatInputCommandInteraction,
    Locale,
    RESTPostAPIApplicationCommandsJSONBody
} from "discord.js";
import {postError} from "../util/postEmbeds";

export abstract class AbstractCommand {
    public readonly name!: string;

    protected readonly description!: string;
    protected readonly localizedDescriptions?: Partial<Record<Locale, string>>;

    protected readonly options!: APIApplicationCommandOption[];

    protected sanitizedInputs: Record<string, any> = {};

    /**
     * Executes command after permissions were checked and options were verified
     */
    public async execute(interaction: ChatInputCommandInteraction): Promise<void>{
        try{
            await this.checkPermissions(interaction);
            if(this.options.length){
                await this.checkOptions(interaction);
            }
            this.run(interaction);
        }catch (error){
            let errorMessage: string = "Unbekannter Fehler";

            if (error instanceof Error){
                errorMessage = error.message;
            }

            await postError(interaction, errorMessage);
        }
    }

    /**
     * Builds json structure for slash command
     */
    public buildSlashCommandJSON(): RESTPostAPIApplicationCommandsJSONBody {
        //base properties
        const command: RESTPostAPIApplicationCommandsJSONBody = {
            name: this.name,
            description: this.description
        }

        //localization: description
        if(this.localizedDescriptions && Object.keys(this.localizedDescriptions).length > 0){
            command.description_localizations = this.localizedDescriptions;
        }

        //options
        if(this.options && Object.keys(this.options).length > 0){
            command.options = this.options;
        }

        return command;
    }

    /**
     * Checks if current user is allowed to execute this command
     */
    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {}

    /**
     * Validates options if given
     */
    protected async checkOptions(interaction: ChatInputCommandInteraction): Promise<void> {}

    /**
     * Runs actual command
     */
    protected abstract run(interaction: ChatInputCommandInteraction): void
}