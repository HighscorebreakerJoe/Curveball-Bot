import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    LabelBuilder,
    ModalSubmitInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import { ModalInputDraftRow } from "../database/table/ModalInputDraft";
import { tModal } from "../i18n";
import { AbstractModal } from "./AbstractModal";
import { NoticeCreateModalInputType } from "./type/NoticeCreateModalInputType";

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

    protected setSubmitCustomID() {
        this.submitCustomId = "notice_create";
    }

    protected buildInputs(): Record<string, LabelBuilder> {
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

    protected async applyDraftInputValues(inputs: Record<string, LabelBuilder>, draft: ModalInputDraftRow): Promise<void> {
        const { title, description, type } = inputs;

        const formData = draft.formData as NoticeCreateModalInputType;

        if(formData === null){
            return;
        }

        try {
            // title
            if(formData.title !== undefined) {
                const titleInput = title.data.component as TextInputBuilder;
                titleInput.setValue(String(formData.title));
            }

            // description
            if(formData.description !== undefined) {
                const descriptionInput = description.data.component as TextInputBuilder;
                descriptionInput.setValue(String(formData.description));
            }

            // type
            if(formData.type !== undefined) {
                const typeInput = type.data.component as TextInputBuilder;
                typeInput.setValue(String(formData.type));
            }
        } catch {
            console.error(tModal("global.error.applyDraft"));
        }
    };
}
