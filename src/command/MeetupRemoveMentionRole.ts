/**
 * Command for removing roles from the allowed mention roles whitelist
 */
import {
    APIApplicationCommandOption,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Locale,
    MessageFlags
} from "discord.js";
import {removeRole} from "../cache/meetupAllowedMentionsRoles";
import {db} from "../database/Database";
import {postSuccess} from "../util/postEmbeds";
import {MeetupAddMentionRoleCommand} from "./MeetupAddMentionRole";

export class MeetupRemoveMentionRoleCommand extends MeetupAddMentionRoleCommand {
    name: string = "meetup_remove_mention_role";

    description: string = "Removes a role from the mentionable roles list for meetups";
    localizedDescriptions = {
        [Locale.German]: "Entfernt eine Rolle aus den erwähnbaren Rollen für Meetups"
    };

    options: APIApplicationCommandOption[] = [
        {
            name: "role",
            description: "The role which will be removed from the mentionable roles",
            description_localizations: {
                [Locale.German]: "Die Rolle, die aus den erwähnbaren Rollen entfernt werden soll"
            },
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ];

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //post defer reply to prevent timeout errors
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const { role } = this.sanitizedInputs;

        await db.deleteFrom("meetup_allowed_mentions_role")
            .where("roleID", "=", role.id)
            .execute();

        //create success embed
        await postSuccess(interaction, `Die Rolle <@&${role.id}> ist nun nicht mehr in Meetups erwähnbar`);
    }

    protected async checkInList(roleID: string): Promise<void>{
        //check if role is in list
        const result = await db.selectFrom("meetup_allowed_mentions_role")
            .select("roleID")
            .where("roleID", "=", roleID)
            .execute();

        removeRole(roleID);

        if (!result.length) {
            throw new Error(`Die Rolle <@&${roleID}> befindet sich nicht in den erwähnabren Rollen`);
        }
    }
}