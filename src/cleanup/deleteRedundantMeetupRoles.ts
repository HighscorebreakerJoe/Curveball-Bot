import { Role } from "discord.js";
import { getGuild } from "../cache/guild";
import { meetupRoleRegExp } from "../constant/meetupRoleRegExp";
import { getAllMeetupIDs } from "../database/table/Meetup";
import { deleteRole } from "./deleteRole";

/**
 * Deletes meetup roles which were used by already deleted meetups
 */

export async function deleteRedundantMeetupRoles(): Promise<void> {
    const existingMeetupIDs: Set<number> = new Set(await getAllMeetupIDs());

    getGuild().roles.cache.forEach(
        (role: Role) => deleteValidRole(role, existingMeetupIDs)
    )
}

async function deleteValidRole(role: Role, existingMeetupIDs: Set<number>): Promise<void> {
    const match = role.name.match(meetupRoleRegExp);

    //check if role is a meetup role
    if (!match) {
        return;
    }

    const number = Number(match[1]);

    //number is not in existing IDs -> delete role
    if(!existingMeetupIDs.has(number)) {
        await deleteRole(role);
    }
}
