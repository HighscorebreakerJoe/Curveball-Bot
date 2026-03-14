import { inlineCode } from "discord.js";
import { ParticipantData } from "./editMeetupInfoEmbed";

/**
 * Prints participant data for meetup embed
 */
export function printParticipantData(
    data: ParticipantData,
    asList = false,
    showUnsure = true,
): string {
    let additionalParticipants: number = data.participants - 1;

    return (
        (asList ? "- " : "") +
        data.nickname +
        " " +
        (additionalParticipants > 0 ? inlineCode("+" + additionalParticipants) : "") +
        (showUnsure && data.unsure ? "🤷" : "") +
        (data.remote ? "🚀" : "")
    );
}
