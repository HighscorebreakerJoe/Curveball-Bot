import nodeCron from "node-cron";
import {tCronjob, tSetup} from "../i18n";
import {cleanupMeetupData} from "../util/cleanupMeetupData";

export async function setupHourlyCleanupCronjob(): Promise<void> {
    nodeCron.schedule("0 0 * * * *", cronjob,
        {
            timezone: "Europe/Berlin"
        }
    );

    console.log(tSetup("step.setupHourlyCleanupCronjob"));
}

async function cronjob(): Promise<void> {
    try {
        await cleanupMeetupData();
        console.log(tCronjob("hourlyCleanup.success", {time: new Date().toISOString()}));
    }
    catch (error) {
        console.error(tCronjob("hourlyCleanup.error", {time: new Date().toISOString()}), error);
    }
}