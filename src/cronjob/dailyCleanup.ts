import nodeCron from "node-cron";
import {tCronjob, tSetup} from "../i18n";
import {cleanupMeetupData} from "../util/cleanupMeetupData";

export async function setupDailyCleanupCronjob(): Promise<void> {
    nodeCron.schedule("0 0 0 * * *", cronjob,
        {
            timezone: "Europe/Berlin"
        }
    );

    console.log(tSetup("step.setupDailyCleanupCronjob"));
}

async function cronjob(): Promise<void> {
    try {
        await cleanupMeetupData();
        console.log(tCronjob("dailyCleanup.success", {time: new Date().toISOString()}));
    }
    catch (error) {
        console.error(tCronjob("dailyCleanup.error", {time: new Date().toISOString()}), error);
    }
}