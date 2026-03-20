import nodeCron from "node-cron";
import { getMeetupCreateChannel } from "../cache/meetupChannels";
import env from "../env";
import { tCronjob, tSetup } from "../i18n";
import { deleteRedundantMeetupThreads } from "../util/meetup/deleteRedundantMeetupThreads";

export async function setupDailyCleanupCronjob(): Promise<void> {
    nodeCron.schedule("0 30 0 * * *", cronjob);
    console.log(tSetup("step.setupDailyCleanupCronjob"));
}

async function cronjob(): Promise<void> {
    try {
        await deleteRedundantMeetupThreads();
        await deleteNonBotMessagesFromCreateChannel();

        console.log(tCronjob("dailyCleanup.success", { time: new Date().toISOString() }));
    } catch (error) {
        console.error(tCronjob("dailyCleanup.error", { time: new Date().toISOString() }), error);
    }
}

async function deleteNonBotMessagesFromCreateChannel(): Promise<void> {
    const messages = await getMeetupCreateChannel().messages.fetch({ limit: 100 });
    const filteredMessages = messages.filter(
        (message) => !message.author.bot || message.author.id !== env.CLIENT_ID,
    );

    await getMeetupCreateChannel().bulkDelete(filteredMessages);
}
