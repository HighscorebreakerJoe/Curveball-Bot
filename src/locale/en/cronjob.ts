import { TranslationObject } from "../../i18n";

const cronjob: TranslationObject = {
    hourlyCleanup: {
        success: "Cronjob: HourlyCleanup - Success - {{time}}.",
        error: "Cronjob: HourlyCleanup - Failed - {{time}}.",
    },

    dailyCleanup: {
        success: "Cronjob: DailyCleanup - Success - {{time}}.",
        error: "Cronjob: DailyCleanup - Failed - {{time}}.",
    },
};

export default cronjob;
