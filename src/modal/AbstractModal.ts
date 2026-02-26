/**
 * Base class for all modals for Curveball Bot. Handles building modals and its user inputs
 */
import { ButtonInteraction, ChatInputCommandInteraction, ModalBuilder } from "discord.js";
import { postError } from "../util/postEmbeds";

export abstract class AbstractModal {
    public readonly customId!: string;
    protected submitCustomId!: string;
    protected additionalData: Record<string, any> = {};

    /**
     * Prepares and displays modal
     */
    public async execute(
        interaction: ChatInputCommandInteraction | ButtonInteraction,
    ): Promise<void> {
        try {
            await this.checkPermissions(interaction);
            this.setSubmitCustomId();
            const modal: ModalBuilder = this.buildModal();
            await this.preShowModal(interaction);
            await interaction.showModal(modal);
        } catch (error) {
            let errorMessage: string = "Unbekannter Fehler";

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
    protected abstract buildModal(): ModalBuilder;

    /**
     * Sets customId for modal submit
     */
    protected setSubmitCustomId(): void {
        this.submitCustomId = this.customId;
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
}
