/**
 * Command for adding roles to the allowed mention roles whitelist
 */
import {
    APIApplicationCommandOption,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    MessageFlags
} from "discord.js";
import {addRole} from "../cache/meetupAllowedMentionsRoles";
import {db} from "../database/Database";
import {tCommand} from "../i18n";
import {assertMeetupCreateChannelUsed} from "../permission/assertMeetupCreateChannelUsed";
import {assertUserHasMeetupConfigRole} from "../permission/assertUserHasMeetupConfigRole";
import {postSuccess} from "../util/postEmbeds";
import {AbstractCommand} from "./AbstractCommand";

export class MeetupAddMentionRoleCommand extends AbstractCommand {
    name: string = "meetup_add_mention_role";

    protected get description(): string {
        return tCommand("meetupAddMention.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [
            {
                name: "role",
                description: tCommand("meetupAddMention.option.roleDescription"),
                type: ApplicationCommandOptionType.Role,
                required: true
            }
        ];
    }

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async checkOptions(interaction: ChatInputCommandInteraction): Promise<void> {
        //check role
        const role = interaction.options.getRole("role");

        if (!role) {
            throw new Error(tCommand("meetupAddMention.error.invalidRole"));
        }

        this.sanitizedInputs = {
            role
        }

        await this.checkInList(role.id);
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //post defer reply to prevent timeout errors
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const { role } = this.sanitizedInputs;

        await db.insertInto("meetup_allowed_mentions_role")
            .values({
                roleID: role.id,
                userID: interaction.user.id
            })
            .execute();

        addRole(role.id);

        //create success embed
        await postSuccess(interaction, `Die Rolle <@&${role.id}> ist nun in Meetups erwähnbar`);
    }

    protected async checkInList(roleID: string): Promise<void>{
        //check if role is in list
        const result = await db.selectFrom("meetup_allowed_mentions_role")
            .select("roleID")
            .where("roleID", "=", roleID)
            .execute();

        if (result.length) {
            throw new Error(tCommand("meetupAddMention.error.roleAlreadyAdded", {roleID: roleID}));
        }
    }
}