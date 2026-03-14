import nodeCron from "node-cron";
import { tCronjob, tSetup } from "../i18n";
import { deleteRedundantMeetupThreads } from "../util/deleteRedundantMeetupThreads";

export async function setupDailyCleanupCronjob(): Promise<void> {
    nodeCron.schedule("0 30 0 * * *", cronjob);
    console.log(tSetup("step.setupDailyCleanupCronjob"));
}

async function cronjob(): Promise<void> {
    try {
        await deleteRedundantMeetupThreads();
        console.log(tCronjob("dailyCleanup.success", { time: new Date().toISOString() }));
    } catch (error) {
        console.error(tCronjob("dailyCleanup.error", { time: new Date().toISOString() }), error);
    }
}
