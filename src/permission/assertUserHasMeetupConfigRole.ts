/**
 * Checks if user has meetup configurator role
 */
import {ChatInputCommandInteraction, GuildMember} from "discord.js";
import env from "../env";
import {tPermission} from "../i18n";

export function assertUserHasMeetupConfigRole(interaction: ChatInputCommandInteraction): void {
    const meetupConfigRoleID = env.MEETUP_CONFIGURATOR_ROLE_ID;
    const member = interaction.member as GuildMember;

    if (!member.roles.cache.has(meetupConfigRoleID)) {
        throw new Error(tPermission("error.memberCantExecuteCommand"));
    }
}