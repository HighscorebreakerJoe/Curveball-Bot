import { APIApplicationCommandOption, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { tCommand } from "../i18n";
import { assertMeetupCreateChannelUsed } from "../permission/assertMeetupCreateChannelUsed";
import { assertUserHasMeetupConfigRole } from "../permission/assertUserHasMeetupConfigRole";
import { postMeetupCreateNotices } from "../util/meetup/postMeetupCreateNotices";
import { AbstractCommand } from "./AbstractCommand";

/**
 * Command for posting default meetup create notices
 */

export class PostMeetupCreateNoticesCommand extends AbstractCommand {
    name: string = "post_meetup_create_notices";

    protected get description(): string {
        return tCommand("postMeetupCreateNotices.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [];
    }

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        await postMeetupCreateNotices();

        await interaction.deleteReply();
    }
}
