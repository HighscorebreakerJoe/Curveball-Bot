import nodeCron from "node-cron";
import { deleteOldMeetups } from "../cleanup/deleteOldMeetups";
import { deleteRedundantMeetupMessages } from "../cleanup/deleteRedundantMeetupMessages";
import { AuditLogAction } from "../constant/auditLogAction";
import { createAuditLog } from "../database/table/AuditLog";
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
        await createAuditLog(AuditLogAction.CRON_HOURLY_SUCCESS);
    } catch (error) {
        console.error(tCronjob("hourlyCleanup.error", { time: new Date().toISOString() }), error);
        await createAuditLog(AuditLogAction.CRON_HOURLY_ERROR, {
            additionalInformation: error instanceof Error ? error.message : String(error),
        });
    }
}

async function runCleanup(): Promise<void> {
    await createAuditLog(AuditLogAction.CRON_HOURLY_RUN);
    
    await deleteOldMeetups();
    await deleteRedundantMeetupMessages();

    scheduleManager.scheduleResetMeetupList();
}
