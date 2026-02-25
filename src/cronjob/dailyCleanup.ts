import {ThreadChannel} from "discord.js";
import nodeCron from "node-cron";
import {getAllMeetupThreadIDs} from "../database/table/Meetup";
import {tCommon, tCronjob, tMeetup, tSetup} from "../i18n";
import {delay} from "../util/delay";
import {getAllAvailableMeetupInfoThreads} from "../util/getAllAvailableMeetupInfoThreads";

export async function setupDailyCleanupCronjob(): Promise<void> {
    nodeCron.schedule("0 30 0 * * *", cronjob,
        {
            timezone: "Europe/Berlin"
        }
    );

    console.log(tSetup("step.setupDailyCleanupCronjob"));
}

async function cronjob(): Promise<void> {
    try {
        await deleteRedundantThreads();
        console.log(tCronjob("dailyCleanup.success", {time: new Date().toISOString()}));
    }
    catch (error) {
        console.error(tCronjob("dailyCleanup.error", {time: new Date().toISOString()}), error);
    }
}

async function deleteRedundantThreads(): Promise<void> {
    const availableThreads: ThreadChannel[] = await getAllAvailableMeetupInfoThreads();

    if(!availableThreads.length){
        return;
    }

    const threadIDs: Set<string> = new Set(await getAllMeetupThreadIDs());

    const toDeleteThreads = availableThreads.filter((thread: ThreadChannel) =>
        !threadIDs.has(thread.id)
    );

    for(const thread of toDeleteThreads){
        try{
            await thread.delete(tMeetup("info.threadDefaultDeleteReason"));
            await delay(500);
        } catch (error) {
            console.error(tCommon("error.threadDeleteError"));
        }
    }
}