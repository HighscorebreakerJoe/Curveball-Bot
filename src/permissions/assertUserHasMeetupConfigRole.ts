/**
 * Checks if user has meetup configurator role
 */
import {ChatInputCommandInteraction, GuildMember} from "discord.js";
import env from "../env";

export function assertUserHasMeetupConfigRole(interaction: ChatInputCommandInteraction): void {
    const meetupConfigRoleID = env.MEETUP_CONFIGURATOR_ROLE_ID;
    const member = interaction.member as GuildMember;

    if (!member.roles.cache.has(meetupConfigRoleID)) {
        throw new Error("Du hast nicht die notwendigen Rechte für dieses Kommando...");
    }
}