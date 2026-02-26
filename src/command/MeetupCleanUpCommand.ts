/**
 * Command for cleaning up meetup data and channels
 */
import { APIApplicationCommandOption, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { tCommand } from "../i18n";
import { assertMeetupCreateChannelUsed } from "../permission/assertMeetupCreateChannelUsed";
import { assertUserHasMeetupConfigRole } from "../permission/assertUserHasMeetupConfigRole";
import { cleanupMeetupData } from "../util/cleanupMeetupData";
import { postSuccess } from "../util/postEmbeds";
import { AbstractCommand } from "./AbstractCommand";

export class MeetupCleanUpCommand extends AbstractCommand {
    name: string = "meetup_cleanup";

    protected get description(): string {
        return tCommand("meetupCleanup.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [];
    }

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //post defer reply to prevent timeout errors
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        await cleanupMeetupData();

        //create success embed
        await postSuccess(interaction, tCommand("meetupCleanup.success"));
    }
}
