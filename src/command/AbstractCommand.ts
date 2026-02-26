/**
 * Base class for all commands for Curveball Bot
 */

import {
    APIApplicationCommandOption,
    ChatInputCommandInteraction,
    RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { tCommon } from "../i18n";
import { postError } from "../util/postEmbeds";

export abstract class AbstractCommand {
    public readonly name!: string;
    protected sanitizedInputs: Record<string, any> = {};

    protected abstract get description(): string;

    protected abstract get options(): APIApplicationCommandOption[];

    /**
     * Executes command after permissions were checked and options were verified
     */
    public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            await this.checkPermissions(interaction);
            if (this.options.length) {
                await this.checkOptions(interaction);
            }
            this.run(interaction);
        } catch (error) {
            let errorMessage: string = tCommon("error.unknown");

            if (error instanceof Error) {
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
            description: this.description,
        };

        //options
        if (this.options && this.options.length > 0) {
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
    protected abstract run(interaction: ChatInputCommandInteraction): void;
}
