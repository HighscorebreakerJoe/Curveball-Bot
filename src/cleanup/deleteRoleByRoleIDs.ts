import { DiscordAPIError } from "discord.js";
import { getGuild } from "../cache/guild";
import { tCommon, tMeetup } from "../i18n";
import { delay } from "../util/delay";

/**
 * Delete roles by their roleIDs
 */
export async function deleteRoleByRoleIDs(roleIDs: string[]): Promise<void> {
    for (const roleID of roleIDs) {
        try {
            await getGuild().roles.delete(roleID, tCommon("defaultDeleteReason"));
            await delay(500);
        } catch (error: unknown) {
            if (error instanceof DiscordAPIError && error.code === 10011) {
                continue;
            }

            console.error(tMeetup("role.error.delete", { roleID: roleID }), error);
        }
    }
}