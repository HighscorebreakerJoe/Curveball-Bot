/**
 * Function for removing a role from a user
 */
import { GuildMember } from "discord.js";
import { getGuild } from "../cache/guild";
import { tCommon, tMeetup } from "../i18n";

export async function removeRole(userID: string, roleID: string): Promise<void> {
    try {
        const member: GuildMember = await getGuild().members.fetch(userID);

        if (member.roles.cache.has(roleID)) {
            await member.roles.remove(roleID, tCommon("defaultAssignReason"));
        }
    } catch (error) {
        console.log(tMeetup("role.error.removeRole", { userID: userID, roleID: roleID }), error);
    }
}
