import { ButtonInteraction, ChatInputCommandInteraction, LabelBuilder, ModalBuilder } from "discord.js";
import { getModalInputDrafts, ModalInputDraftRow } from "../database/table/ModalInputDraft";
import { tModal } from "../i18n";
import { postError } from "../util/postEmbeds";

/**
 * Base class for all modals for Curveball Bot. Handles building modals and its user inputs
 */

export abstract class AbstractModal {
    public readonly customId!: string;
    protected submitCustomId!: string;
    protected additionalData: Record<string, any> = {};
    protected interactionUserID: string = "";
    protected draftCustomID: string = "";
    protected useDraftAsInputRestore: boolean = true;

    protected get modalTitle(): string {
        return tModal("global.placeholder");
    }

    /**
     * Prepares and displays modal
     */
    public async execute(
        interaction: ChatInputCommandInteraction | ButtonInteraction,
    ): Promise<void> {
        try {
            await this.checkPermissions(interaction);
            this.setSubmitCustomID();
            this.setDraftCustomID();
            this.setInteractionUserID(interaction);
            const modal: ModalBuilder = await this.buildModal();
            await this.preShowModal(interaction);
            await interaction.showModal(modal);
        } catch (error) {
            let errorMessage: string = tModal("global.error.unknown");

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
     * Builds modal including input fields
     */
    protected async buildModal(): Promise<ModalBuilder> {
        const modal: ModalBuilder = new ModalBuilder()
            .setCustomId(this.submitCustomId)
            .setTitle(this.modalTitle);

        const inputs = this.buildInputs();
        await this.setInputValues(inputs);

        modal.addLabelComponents(...Object.values(inputs));

        return modal;
    }

    /**
     * Builds modal including input fields
     */
    protected abstract buildInputs(): Record<string, LabelBuilder>;

    /**
     * Sets the values of the modal's input fields.
     * 
     * May be ignored if an unexpected error occurs and discord applies its own draft.
     */
    protected async setInputValues(inputs: Record<string, LabelBuilder>): Promise<void> {
        if(this.useDraftAsInputRestore) {
            //search for draft if available
            const draft = await getModalInputDrafts(this.interactionUserID, this.draftCustomID);

            if(draft){
                this.applyDraftInputValues(inputs, draft);
                return;
            }
        }

        await this.applyDefaultInputValues(inputs);
    };

    /**
     * Applies values from draft on input fields
     */
    protected async applyDraftInputValues(inputs: Record<string, LabelBuilder>, draft: ModalInputDraftRow): Promise<void> {};

    /**
     * Default behaviour for applying values on input fields (e.g. from database or just do nothing)
     */
    protected async applyDefaultInputValues(inputs: Record<string, LabelBuilder>): Promise<void> {};

    /**
     * Sets customID for modal submit
     */
    protected setSubmitCustomID(): void {
        this.submitCustomId = this.customId;
    }

    /**
     * Sets customId for modal input draft
     */
    protected setDraftCustomID(): void {
        this.draftCustomID = this.customId;
    }

    /**
     * Runs before modal is shown
     */
    protected async preShowModal(
        interaction: ChatInputCommandInteraction | ButtonInteraction,
    ): Promise<void> {}

    /**
     * Checks if current user is allowed to use and submit this modal
     */
    protected async checkPermissions(
        interaction: ChatInputCommandInteraction | ButtonInteraction,
    ): Promise<void> {}

    /**
     * Sets the user ID of the user who opened the modal
     */
    private setInteractionUserID(interaction: ChatInputCommandInteraction | ButtonInteraction): void {
        if(interaction.user.id){
            this.interactionUserID = interaction.user.id;
        }
    }
}
