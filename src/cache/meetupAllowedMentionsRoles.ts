import { db } from "../database/Database";
import { tSetup } from "../i18n";

const meetupAllowedMentionsRoles = new Set<string>();

export async function loadMeetupAllowedMentionsRoles() {
    const rows = await db.selectFrom("meetup_allowed_mentions_role").select("roleID").execute();

    meetupAllowedMentionsRoles.clear();

    for (const row of rows) {
        meetupAllowedMentionsRoles.add(row.roleID);
    }

    console.log(tSetup("step.setupMentionsRolesCache"));
}

export function getMeetupAllowedMentionsRoles(): Set<string> {
    return meetupAllowedMentionsRoles;
}

export function addRole(roleID: string) {
    meetupAllowedMentionsRoles.add(roleID);
}

export function removeRole(roleID: string) {
    meetupAllowedMentionsRoles.delete(roleID);
}
