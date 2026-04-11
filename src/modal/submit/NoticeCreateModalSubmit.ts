import { EmbedBuilder, MessageFlags, ModalSubmitFields, ModalSubmitInteraction } from "discord.js";
import { getMeetupCreateChannel } from "../../cache/meetupChannels";
import { tModal } from "../../i18n";
import { noticeTypeMap } from "../../map/noticeTypeMap";
import { assertUserHasMeetupConfigRole } from "../../permission/assertUserHasMeetupConfigRole";
import { prepareEmbedMessage } from "../../util/postEmbeds";
import { sanitizeTextInput } from "../../util/sanitizeTextInput";
import { AbstractModalSubmit } from "./AbstractModalSubmit";

/**
 * Handles Notice Modal submits
 */

export class NoticeCreateModalSubmit extends AbstractModalSubmit {
    customId: string = "notice_create";
    dynamicId: boolean = true;

    protected async checkPermissions(interaction: ModalSubmitInteraction): Promise<void> {
        assertUserHasMeetupConfigRole(interaction);
    }

    protected checkModalInputs(fields: ModalSubmitFields): void {
        //check title
        const title: string = sanitizeTextInput(fields.getTextInputValue("title"));

        if (!title.length) {
            throw new Error(tModal("noticeCreate.submit.error.titleEmpty"));
        }

        //check description
        const description: string = fields.getTextInputValue("description").trim();

        if (!description.length) {
            throw new Error(tModal("noticeCreate.submit.error.descriptionEmpty"));
        }

        //check type
        const typeValues: readonly string[] = fields.getStringSelectValues("type");

        if (!typeValues.length) {
            throw new Error(tModal("noticeCreate.submit.error.typeEmpty"));
        }

        const type: string = typeValues[0];

        if (!type.length) {
            throw new Error(tModal("noticeCreate.submit.error.typeEmpty"));
        }

        //save inputs for later
        this.sanitizedInputs = {
            title,
            description,
            type,
        };
    }

    /**
     * Posts embed-message after modal inputs have been successfully validated
     */
    protected async successModalInputs(interaction: ModalSubmitInteraction): Promise<void> {
        const { title, description, type } = this.sanitizedInputs;

        let color: number = noticeTypeMap.get("hint")!;

        if (type === "tutorial") {
            color = noticeTypeMap.get("tutorial")!;
        }

        //post embed
        const embed: EmbedBuilder = prepareEmbedMessage(description, title, color);

        await getMeetupCreateChannel().send({
            embeds: [embed],
        });
    }
}
