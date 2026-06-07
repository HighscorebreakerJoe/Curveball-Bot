import nodeCron from "node-cron";
import { deleteOldMeetups } from "../cleanup/deleteOldMeetups";
import { deleteRedundantMeetupMessages } from "../cleanup/deleteRedundantMeetupMessages";
import { tCronjob, tSetup } from "../i18n";
import { scheduleManager } from "../manager/ScheduleManager";

export async function setupHourlyCleanupCronjob(): Promise<void> {
    nodeCron.schedule("0 0 * * * *", cronjob);
    console.log(tSetup("step.setupHourlyCleanupCronjob"));
}

async function cronjob(): Promise<void> {
    try {
        await runCleanup();
        console.log(tCronjob("hourlyCleanup.success", { time: new Date().toISOString() }));
    } catch (error) {
        console.error(tCronjob("hourlyCleanup.error", { time: new Date().toISOString() }), error);
    }
}

async function runCleanup(): Promise<void> {
    await deleteOldMeetups();
    await deleteRedundantMeetupMessages();

    scheduleManager.scheduleResetMeetupList();
}
