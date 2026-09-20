import nodeCron from "node-cron";
import { deleteNonBotMessagesFromCreateChannel } from "../cleanup/deleteNonBotMessagesFromCreateChannel";
import { deleteOldModalInputDrafts } from "../cleanup/deleteOldModalInputDrafts";
import { deleteRedundantMeetupRoles } from "../cleanup/deleteRedundantMeetupRoles";
import { deleteRedundantMeetupThreads } from "../cleanup/deleteRedundantMeetupThreads";
import { AuditLogAction } from "../constant/auditLogAction";
import { createAuditLog } from "../database/table/AuditLog";
import { tCronjob, tSetup } from "../i18n";
import { logger } from "../logger";

export async function setupDailyCleanupCronjob(): Promise<void> {
    nodeCron.schedule("0 30 0 * * *", cronjob);
    console.log(tSetup("step.setupDailyCleanupCronjob"));
}

async function cronjob(): Promise<void> {
    try {
        await runCleanup();

        console.log(tCronjob("dailyCleanup.success", { time: new Date().toISOString() }));
        await createAuditLog(AuditLogAction.CRON_DAILY_SUCCESS);
    } catch (error) {
        logger.error(
            { err: error },
            tCronjob("dailyCleanup.error", { time: new Date().toISOString() }),
        );
        await createAuditLog(AuditLogAction.CRON_DAILY_ERROR, {
            additionalInformation: error instanceof Error ? error.message : String(error),
        });
    }
}

async function runCleanup(): Promise<void> {
    await createAuditLog(AuditLogAction.CRON_DAILY_RUN);

    await deleteRedundantMeetupThreads();
    await deleteRedundantMeetupRoles();
    await deleteNonBotMessagesFromCreateChannel();

    await deleteOldModalInputDrafts();
}
