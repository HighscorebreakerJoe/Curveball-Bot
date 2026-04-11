import { MessageFlags, ModalSubmitFields, ModalSubmitInteraction } from "discord.js";
import { tCommon } from "../../i18n";
import { postError } from "../../util/postEmbeds";
import { InteractionResponseMode } from "../../constant/interactionResponseMode";

/**
 * Base class for all modals submit handlers for Curveball Bot.
 */

export abstract class AbstractModalSubmit {
    public readonly customId!: string;
    public readonly dynamicId!: boolean;
    protected sanitizedInputs: Record<string, any> = {};
    protected additionalData: Record<string, any> = {};
    protected responseMode = InteractionResponseMode.UPDATE;

    /**
     * Handles user inputs from modal
     */
    public async execute(interaction: ModalSubmitInteraction): Promise<void> {
        try {
            await this.prepareResponse(interaction);
            await this.checkPermissions(interaction);
            this.checkModalInputs(interaction.fields);
            await this.successModalInputs(interaction);
        } catch (error) {
            let errorMessage: string = tCommon("error.unknown");

            if (error instanceof Error) {
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
    }

    /**
     * Checks if current user is allowed to use and submit this modal
     */
    protected async checkPermissions(interaction: ModalSubmitInteraction): Promise<void> {}

    /**
     * Checks and verifies user inputs of this modal
     */
    protected checkModalInputs(fields: ModalSubmitFields): void {}

    /**
     * Called after user inputs of this modal have been successfully verified
     */
    protected async successModalInputs(interaction: ModalSubmitInteraction): Promise<void> {}

    /**
     * Sets the interaction response for this modal submit. Run this as early as possible after a submit to prevent timeout errors
     */
    private async prepareResponse(interaction: ModalSubmitInteraction) {
        switch(this.responseMode){
            case InteractionResponseMode.UPDATE:
                await interaction.deferUpdate();
                break;

            case InteractionResponseMode.REPLY:
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                break;

            case InteractionResponseMode.NONE:
                //do nothing;
                break;
        }
    }
}
