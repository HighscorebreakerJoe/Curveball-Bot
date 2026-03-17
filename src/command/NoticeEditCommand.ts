import {
    APIApplicationCommandOption,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
} from "discord.js";
import { tCommand } from "../i18n";
import { modalsMap } from "../map/modalsMap";
import { assertMeetupCreateChannelUsed } from "../permission/assertMeetupCreateChannelUsed";
import { assertUserHasMeetupConfigRole } from "../permission/assertUserHasMeetupConfigRole";
import { assertValidMessageInMeetupCreateChannel } from "../permission/assertValidMessageInMeetupCreateChannel";
import { AbstractCommand } from "./AbstractCommand";

/**
 * Command for editing an embed-message from meetup create channel
 */

export class NoticeEditCommand extends AbstractCommand {
    name: string = "notice_edit";

    protected get description(): string {
        return tCommand("noticeEdit.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [
            {
                name: "message_id",
                description: tCommand("noticeEdit.option.messageIDDescription"),
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ];
    }

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async checkOptions(interaction: ChatInputCommandInteraction): Promise<void> {
        //check messageID
        const messageID = interaction.options.getString("message_id")?.trim();

        if (!messageID) {
            throw new Error(tCommand("noticeEdit.error.invalidMessageID"));
        }

        await assertValidMessageInMeetupCreateChannel(messageID);

        this.sanitizedInputs = {
            messageID,
        };
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //show modal
        const NoticeEditModalClass = modalsMap.get("notice_edit");
        if (!NoticeEditModalClass) {
            return;
        }

        const editNoticeModal = new NoticeEditModalClass();
        await editNoticeModal.execute(interaction);
    }
}
