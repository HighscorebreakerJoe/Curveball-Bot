/**
 * Command for adding roles to the allowed mention roles whitelist
 */
import {
    APIApplicationCommandOption,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Locale,
    MessageFlags
} from "discord.js";
import {addRole} from "../cache/meetupAllowedMentionsRoles";
import {db} from "../database/Database";
import {assertMeetupCreateChannelUsed} from "../permission/assertMeetupCreateChannelUsed";
import {assertUserHasMeetupConfigRole} from "../permission/assertUserHasMeetupConfigRole";
import {postSuccess} from "../util/postEmbeds";
import {AbstractCommand} from "./AbstractCommand";

export class MeetupAddMentionRoleCommand extends AbstractCommand {
    name: string = "meetup_add_mention_role";

    description: string = "Adds a role to the mentionable roles list for meetups";
    localizedDescriptions = {
        [Locale.German]: "Fügt eine Rolle zu den erwähnbaren Rollen in Meetups zu"
    };

    options: APIApplicationCommandOption[] = [
        {
            name: "role",
            description: "The role which will be added to the mentionable roles",
            description_localizations: {
                [Locale.German]: "Die Rolle, die zu den erwähnbaren Rollen hinzugefügt werden soll"
            },
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ];

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async checkOptions(interaction: ChatInputCommandInteraction): Promise<void> {
        //check role
        const role = interaction.options.getRole("role");

        if (!role) {
            throw new Error("Die angegebene Rolle konnte nicht gefunden werden");
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
            throw new Error(`Die Rolle <@&${roleID}> befindet sich bereits in den erwähnabren Rollen`);
        }
    }
}