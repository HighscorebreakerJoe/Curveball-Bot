/**
 * Base class for all buttons for Curveball Bot. Handles buttons when activated.
 */
import {ButtonInteraction} from "discord.js";
import {postError} from "../util/postEmbeds";

export abstract class AbstractButton {
    public readonly customId!: string;

    /**
     * Executes function of this button after being activated
     */
    public async execute(interaction: ButtonInteraction): Promise<void>{
        try{
            await this.checkPermissions(interaction);
            await this.run(interaction);
        }catch (error){
            let errorMessage: string = "Unbekannter Fehler";

            if (error instanceof Error){
                errorMessage = error.message;
            }

            await postError(interaction, errorMessage);
        }
    }

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {}

    /**
     * Runs actual command
     */
    protected async run(interaction: ButtonInteraction): Promise<void> {}
}