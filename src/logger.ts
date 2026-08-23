import path from "node:path";
import pino from "pino";
import env from "./env";

/**
 * Central application logger for Curveball Bot.
 */

const transport = pino.transport({
    target: "pino-roll",
    options: {
        file: path.join(process.cwd(), "log", "curveball-bot.jsonl"),
        frequency: "daily",
        dateFormat: "yyyy-MM-dd",
        extension: ".jsonl",
        mkdir: true,
    },
});

export const logger = pino(
    {
        level: env.LOG_LEVEL,
        timestamp: pino.stdTimeFunctions.isoTime,
        base: {
            stage: process.env.STAGE ?? "unknown",
        },
    },
    transport,
);
