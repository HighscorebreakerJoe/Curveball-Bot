import { APIApplicationCommandOption, ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { deleteOldMeetups } from "../cleanup/deleteOldMeetups";
import { deleteRedundantMeetupMessages } from "../cleanup/deleteRedundantMeetupMessages";
import { deleteRedundantMeetupRoles } from "../cleanup/deleteRedundantMeetupRoles";
import { deleteRedundantMeetupThreads } from "../cleanup/deleteRedundantMeetupThreads";
import { tCommand } from "../i18n";
import { scheduleManager } from "../manager/ScheduleManager";
import { assertMeetupCreateChannelUsed } from "../permission/assertMeetupCreateChannelUsed";
import { assertUserHasMeetupConfigRole } from "../permission/assertUserHasMeetupConfigRole";
import { postSuccess } from "../util/postEmbeds";
import { AbstractCommand } from "./AbstractCommand";

/**
 * Command for cleaning up meetup data and channels
 */

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

        await this.runCleanup();

        //create success embed
        await postSuccess(interaction, tCommand("meetupCleanup.success"));
    }

    private async runCleanup(): Promise<void> {
        await deleteOldMeetups();
        await deleteRedundantMeetupThreads();
        await deleteRedundantMeetupRoles();
        await deleteRedundantMeetupMessages();
    
        scheduleManager.scheduleResetMeetupList();
    }
}
