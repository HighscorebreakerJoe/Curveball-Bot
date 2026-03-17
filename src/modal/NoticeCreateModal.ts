import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    LabelBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { tModal } from "../i18n";
import { AbstractModal } from "./AbstractModal";

/**
 * Displays Create Notice Modal
 */

export class NoticeCreateModal extends AbstractModal {
    customId: string = "notice_create";
    private allowedCommands: string[] = ["notice_create"];

    protected get modalTitle(): string {
        return tModal("noticeCreate.title");
    }

    protected async checkPermissions(
        interaction: ChatInputCommandInteraction | ButtonInteraction | ModalSubmitInteraction,
    ): Promise<void> {
        //check interaction type
        if (!interaction.isCommand()) {
            throw new Error(tModal("global.error.invalidInteractionType"));
        }

        if (!this.allowedCommands.includes(interaction.commandName)) {
            const interactionName: string = (interaction as ChatInputCommandInteraction)
                .commandName;
            throw new Error(
                tModal("global.error.invalidCommand", { commandName: interactionName }),
            );
        }
    }

    protected setSubmitCustomId() {
        this.submitCustomId = "notice_create";
    }

    protected buildModal(): ModalBuilder {
        const modal: ModalBuilder = new ModalBuilder()
            .setCustomId(this.submitCustomId)
            .setTitle(this.modalTitle);

        const { title, description, type } = this.buildInputs();
        modal.addLabelComponents(title, description, type);

        return modal;
    }

    protected buildInputs() {
        const titleInput: TextInputBuilder = new TextInputBuilder()
            .setCustomId("title")
            .setPlaceholder(tModal("noticeCreate.field.titlePlaceholder"))
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const title: LabelBuilder = new LabelBuilder()
            .setLabel(tModal("noticeCreate.field.title"))
            .setTextInputComponent(titleInput);

        const descriptionInput: TextInputBuilder = new TextInputBuilder()
            .setCustomId("description")
            .setPlaceholder(tModal("noticeCreate.field.descriptionPlaceholder"))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const description: LabelBuilder = new LabelBuilder()
            .setLabel(tModal("noticeCreate.field.description"))
            .setTextInputComponent(descriptionInput);

        const typeInput: StringSelectMenuBuilder = new StringSelectMenuBuilder()
            .setCustomId("type")
            .setPlaceholder(tModal("noticeCreate.field.typePlaceholder"))
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(tModal("noticeCreate.field.typeHint.label"))
                    .setDescription(tModal("noticeCreate.field.typeHint.description"))
                    .setValue("hint"),

                new StringSelectMenuOptionBuilder()
                    .setLabel(tModal("noticeCreate.field.typeTutorial.label"))
                    .setDescription(tModal("noticeCreate.field.typeTutorial.description"))
                    .setValue("tutorial"),
            )
            .setRequired(true);

        const type: LabelBuilder = new LabelBuilder()
            .setLabel(tModal("noticeCreate.field.type"))
            .setStringSelectMenuComponent(typeInput);

        return {
            title: title,
            description: description,
            type: type,
        };
    }
}
