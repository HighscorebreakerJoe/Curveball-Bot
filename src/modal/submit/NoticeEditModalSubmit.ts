import { EmbedBuilder, Message, ModalSubmitInteraction } from "discord.js";
import { AuditLogAction } from "../../constant/auditLogAction";
import { createAuditLog } from "../../database/table/AuditLog";
import { noticeTypeMap } from "../../map/noticeTypeMap";
import { assertMessageHasOneEmbed } from "../../permission/assertMessageHasOneEmbed";
import { assertMessagePostedByBot } from "../../permission/assertMessagePostedByBot";
import { assertUserHasMeetupConfigRole } from "../../permission/assertUserHasMeetupConfigRole";
import { assertValidMessageInMeetupCreateChannel } from "../../permission/assertValidMessageInMeetupCreateChannel";
import { getDynamicData } from "../../util/getDynamicIDData";
import { prepareEmbedMessage } from "../../util/postEmbeds";
import { NoticeCreateModalSubmit } from "./NoticeCreateModalSubmit";

/**
 * Handles Edit Notice submits
 */

export class NoticeEditModalSubmit extends NoticeCreateModalSubmit {
    customId: string = "notice_edit:{d}";
    dynamicId: boolean = true;

    protected async checkPermissions(interaction: ModalSubmitInteraction): Promise<void> {
        assertUserHasMeetupConfigRole(interaction);

        const messageID: string = getDynamicData(interaction.customId);
        const message: Message = await assertValidMessageInMeetupCreateChannel(messageID);

        assertMessagePostedByBot(message);
        assertMessageHasOneEmbed(message);

        this.setAdditionalData({
            message: message,
        });
    }

    /**
     * Posts meetup after modal inputs have been successfully validated
     */
    protected async successModalInputs(interaction: ModalSubmitInteraction): Promise<void> {
        const { title, description, type } = this.sanitizedInputs;

        const message = this.additionalData.message as Message;

        let color: number = noticeTypeMap.get("hint")!;

        if (type === "tutorial") {
            color = noticeTypeMap.get("tutorial")!;
        }

        const newEmbed: EmbedBuilder = prepareEmbedMessage(description, title, color);

        await message.edit({
            embeds: [newEmbed],
        });

        const additionalInformation: string = JSON.stringify({
            message_id: message.id,
        });

        await createAuditLog(AuditLogAction.NOTICE_EDIT, {
            userID: interaction.user.id,
            additionalInformation: additionalInformation,
        });
    }
}
