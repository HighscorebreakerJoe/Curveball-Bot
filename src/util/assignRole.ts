/**
 * Function for assigning a user a specific role
 */
import { GuildMember } from "discord.js";
import { getGuild } from "../cache/guild";
import { tCommon, tMeetup } from "../i18n";

export async function assignRole(userID: string, roleID: string): Promise<void> {
    try {
        const member: GuildMember = await getGuild().members.fetch(userID);

        if (!member.roles.cache.has(roleID)) {
            await member.roles.add(roleID, tCommon("defaultAssignReason"));
        }
    } catch (error) {
        console.log(tMeetup("role.error.assignRole", { userID: userID, roleID: roleID }), error);
    }
}
