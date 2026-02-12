import {db} from "../database/Database";

const meetupAllowedMentionsRoles = new Set<string>();

export async function loadMeetupAllowedMentionsRoles() {
    const rows = await db.selectFrom("meetup_allowed_mentions_role")
        .select("roleID")
        .execute();

    meetupAllowedMentionsRoles.clear();

    for (const row of rows){
        meetupAllowedMentionsRoles.add(row.roleID);
    }

    console.log("Set up mention roles cache.");
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