/**
 * Command for removing roles from the allowed mention roles whitelist
 */
import {
    APIApplicationCommandOption,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    MessageFlags,
} from "discord.js";
import { removeRole } from "../cache/meetupAllowedMentionsRoles";
import { db } from "../database/Database";
import { tCommand } from "../i18n";
import { postSuccess } from "../util/postEmbeds";
import { MeetupAddMentionRoleCommand } from "./MeetupAddMentionRole";

export class MeetupRemoveMentionRoleCommand extends MeetupAddMentionRoleCommand {
    name: string = "meetup_remove_mention_role";

    protected get description(): string {
        return tCommand("meetupRemoveMention.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [
            {
                name: "role",
                description: tCommand("meetupRemoveMention.option.roleDescription"),
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
        ];
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //post defer reply to prevent timeout errors
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const { role } = this.sanitizedInputs;

        await db.deleteFrom("meetup_allowed_mentions_role").where("roleID", "=", role.id).execute();

        //create success embed
        await postSuccess(
            interaction,
            `Die Rolle <@&${role.id}> ist nun nicht mehr in Meetups erwähnbar`,
        );
    }

    protected async checkInList(roleID: string): Promise<void> {
        //check if role is in list
        const result = await db
            .selectFrom("meetup_allowed_mentions_role")
            .select("roleID")
            .where("roleID", "=", roleID)
            .execute();

        removeRole(roleID);

        if (!result.length) {
            throw new Error(
                tCommand("meetupRemoveMention.error.roleAlreadyAdded", { roleID: roleID }),
            );
        }
    }
}
