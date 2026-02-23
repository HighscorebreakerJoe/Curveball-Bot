/**
 * Base class for all modals submit handlers for Curveball Bot.
 */
import {ModalSubmitFields, ModalSubmitInteraction} from "discord.js";
import {tCommon} from "../../i18n";
import {postError} from "../../util/postEmbeds";

export abstract class AbstractModalSubmit {
    public readonly customId!: string;
    public readonly dynamicId!: boolean;
    protected sanitizedInputs: Record<string, any> = {};
    protected additionalData: Record<string, any> = {};

    /**
     * Handles user inputs from modal
     */
    public async execute(interaction: ModalSubmitInteraction): Promise<void>{
        try{
            await this.checkPermissions(interaction);
            this.checkModalInputs(interaction.fields);
            await this.successModalInputs(interaction);
        }catch (error){
            let errorMessage: string = tCommon("error.unknown");

            if (error instanceof Error){
                errorMessage = error.message;
            }

            await postError(interaction, errorMessage);
        }
    }

    /**
     * Sets additional data for this modal
     */
    public setAdditionalData(additionalData: Record<string, any>): void {
        this.additionalData = additionalData;
    };

    /**
     * Checks if current user is allowed to use and submit this modal
     */
    protected async checkPermissions(interaction: ModalSubmitInteraction): Promise<void> {}

    /**
     * Checks and verifies user inputs of this modal
     */
    protected checkModalInputs(fields: ModalSubmitFields): void {};

    /**
     * Called after user inputs of this modal have been successfully verified
     */
    protected async successModalInputs(interaction: ModalSubmitInteraction): Promise<void> {};
}