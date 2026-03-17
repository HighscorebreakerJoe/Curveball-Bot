import { APIApplicationCommandOption, ChatInputCommandInteraction } from "discord.js";
import { tCommand } from "../i18n";
import { modalsMap } from "../map/modalsMap";
import { assertMeetupCreateChannelUsed } from "../permission/assertMeetupCreateChannelUsed";
import { assertUserHasMeetupConfigRole } from "../permission/assertUserHasMeetupConfigRole";
import { AbstractCommand } from "./AbstractCommand";

/**
 * Command for creating an embed-message in meetup create channel
 */

export class NoticeCreateCommand extends AbstractCommand {
    name: string = "notice_create";

    protected get description(): string {
        return tCommand("noticeCreate.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [];
    }

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //show modal
        const NoticeCreateModalClass = modalsMap.get("notice_create");
        if (!NoticeCreateModalClass) {
            return;
        }

        const createNoticeModal = new NoticeCreateModalClass();
        await createNoticeModal.execute(interaction);
    }
}
