import { Role } from "discord.js";
import { tCommon, tMeetup } from "../i18n";
import { delay } from "../util/delay";

/**
 * Deletes given role
 */
export async function deleteRole(role: Role): Promise<void> {
    try {
        await role.delete(tCommon("defaultDeleteReason"));
        await delay(500);
    } catch (error: unknown) {
        console.error(tMeetup("role.error.delete", { roleID: role.id }), error);
    }
}