import {
    ChatInputCommandInteraction,
    Embed,
    LabelBuilder,
    Message,
    StringSelectMenuBuilder,
    TextInputBuilder,
} from "discord.js";
import { tModal } from "../i18n";
import { noticeTypeMap } from "../map/noticeTypeMap";
import { assertMessageHasOneEmbed } from "../permission/assertMessageHasOneEmbed";
import { assertMessagePostedByBot } from "../permission/assertMessagePostedByBot";
import { assertUserHasMeetupConfigRole } from "../permission/assertUserHasMeetupConfigRole";
import { assertValidMessageInMeetupCreateChannel } from "../permission/assertValidMessageInMeetupCreateChannel";
import { NoticeCreateModal } from "./NoticeCreateModal";

/**
 * Displays Edit Notice Modal
 */

export class NoticeEditModal extends NoticeCreateModal {
    customId: string = "notice_edit";

    protected get modalTitle(): string {
        return tModal("noticeEdit.title");
    }

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.isCommand()) {
            throw new Error(tModal("global.error.invalidInteractionType"));
        }

        assertUserHasMeetupConfigRole(interaction);

        const messageID: string = interaction.options.getString("message_id")!;
        const message = await assertValidMessageInMeetupCreateChannel(messageID);

        assertMessagePostedByBot(message);
        assertMessageHasOneEmbed(message);

        this.setAdditionalData({
            message: message,
        });
    }

    protected setSubmitCustomID() {
        this.submitCustomId = "notice_edit:" + this.additionalData.message.id;
    }

     protected async applyDefaultInputValues(inputs: Record<string, LabelBuilder>): Promise<void> {
        const { title, description, type } = inputs;

        //use message embed directly as default
        const message = this.additionalData.message as Message;
        const embed: Embed = message.embeds[0];

        const titleInput = title.data.component as TextInputBuilder;
        titleInput.setValue(embed.title ?? "");

        const descriptionInput = description.data.component as TextInputBuilder;
        descriptionInput.setValue(embed.description ?? "");

        const typeValue = embed.color === noticeTypeMap.get("hint")! ? "hint" : "tutorial";

        const typeInput = type.data.component as StringSelectMenuBuilder;
        //TODO set type
    };
}
