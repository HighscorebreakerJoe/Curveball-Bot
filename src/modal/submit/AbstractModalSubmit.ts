import { MessageFlags, ModalSubmitFields, ModalSubmitInteraction } from "discord.js";
import { InteractionResponseMode } from "../../constant/interactionResponseMode";
import { db } from "../../database/Database";
import { deleteModalInputDrafts } from "../../database/table/ModalInputDraft";
import { tCommon, tModal } from "../../i18n";
import { postError } from "../../util/postEmbeds";

/**
 * Base class for all modals submit handlers for Curveball Bot.
 */

export abstract class AbstractModalSubmit {
    public readonly customId!: string;
    public readonly dynamicId!: boolean;
    protected sanitizedInputs: Record<string, any> = {};
    protected additionalData: Record<string, any> = {};
    protected responseMode = InteractionResponseMode.UPDATE;
    protected saveInputDraftOnError: boolean = true;
    protected interactionUserID: string = "";
    protected draftCustomID: string = "";

    /**
     * Handles user inputs from modal
     */
    public async execute(interaction: ModalSubmitInteraction): Promise<void> {
        try {
            await this.prepareResponse(interaction);
            await this.checkPermissions(interaction);
            this.setInteractionUserID(interaction);
            this.setDraftCustomID(interaction);
            this.sanitizeModalInputs(interaction.fields);
            this.validateModalInputs();
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
    protected async checkPermissions(_interaction: ModalSubmitInteraction): Promise<void> {}

    /**
     * Sanitizes and stores the modal input values
     */
    protected sanitizeModalInputs(_fields: ModalSubmitFields): void {}

    /**
     * Checks and verifies user inputs of this modal
     */
    protected validateModalInputs(): void {}

    /**
     * Called after user inputs of this modal have been successfully verified
     */
    protected async successModalInputs(_interaction: ModalSubmitInteraction): Promise<void> {}

    /**
     * Handles validation errors for modal inputs
     */
    protected handleError(errorMessage: string): Promise<void> {
        if(this.saveInputDraftOnError){
            this.saveModalInputDraft();
        }

        throw new Error(errorMessage);
    }

    /**
     * Deletes all saved drafts for the current user and modal
     */
    protected async deleteModalInputDraft(): Promise<void> {
       await deleteModalInputDrafts([this.interactionUserID], this.draftCustomID);
    }

    /**
     * Saves the current modal inputs so they can be restored when the user reopens the modal
     */
    private async saveModalInputDraft(): Promise<void> {
        try {
            const formData = JSON.stringify(this.sanitizedInputs);  

            await db
                .insertInto("modal_input_draft")
                .values({
                    userID: this.interactionUserID,
                    draftCustomID: this.draftCustomID,
                    formData: formData,
                })
                .onDuplicateKeyUpdate({
                    formData: formData,
                })
                .execute();  
        } catch (error) {
            console.error(tModal("error.draft"), error);
        }
    }

    /**
     * Sets customId for modal input draft
     */
    protected setDraftCustomID(interaction: ModalSubmitInteraction): void {
        if(interaction.customId){
            this.draftCustomID = interaction.customId;
        }
    }

    /**
     * Sets the interaction response for this modal submit. Run this as early as possible after a submit to prevent timeout errors
     */
    private async prepareResponse(interaction: ModalSubmitInteraction): Promise<void> {
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

    /**
     * Sets the userID of the user who submitted the modal
     */
    private setInteractionUserID(interaction: ModalSubmitInteraction): void {
        if(interaction.user.id){
            this.interactionUserID = interaction.user.id;
        }
    }
}
