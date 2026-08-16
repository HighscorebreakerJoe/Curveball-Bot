import { TranslationObject } from "../../i18n";

const cronjob = {
    hourlyCleanup: {
        success: "Cronjob: HourlyCleanup - Success - {{time}}.",
        error: "Cronjob: HourlyCleanup - Failed - {{time}}.",
    },

    dailyCleanup: {
        success: "Cronjob: DailyCleanup - Success - {{time}}.",
        error: "Cronjob: DailyCleanup - Failed - {{time}}.",
    },
} as const satisfies TranslationObject;

export default cronjob;
