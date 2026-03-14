/**
 * Deletes threads which were linked by already deleted meetups
 */
import { ThreadChannel } from "discord.js";
import { getAllMeetupThreadIDs } from "../../database/table/Meetup";
import { tCommon, tMeetup } from "../../i18n";
import { delay } from "../delay";
import { getAllAvailableMeetupInfoThreads } from "./getAllAvailableMeetupInfoThreads";

export async function deleteRedundantMeetupThreads(): Promise<void> {
    const availableThreads: ThreadChannel[] = await getAllAvailableMeetupInfoThreads();

    if (!availableThreads.length) {
        return;
    }

    const threadIDs: Set<string> = new Set(await getAllMeetupThreadIDs());

    const toDeleteThreads = availableThreads.filter(
        (thread: ThreadChannel) => !threadIDs.has(thread.id),
    );

    for (const thread of toDeleteThreads) {
        try {
            await thread.delete(tMeetup("info.threadDefaultDeleteReason"));
            await delay(500);
        } catch (error) {
            console.error(tCommon("error.threadDeleteError"));
        }
    }
}
