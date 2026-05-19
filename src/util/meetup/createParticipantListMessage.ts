import { bold, inlineCode } from "discord.js";
import { tMeetup } from "../../i18n";
import { ParticipantData } from "./editMeetupInfoEmbed";
import { printParticipantData } from "./printParticipantData";

export function createParticipantListMessage(data: ParticipantData[], maxLength = 2000): string {
    //sum up all participants
    const totalParticipantsCount: number = data.reduce((sum, currentParticipant) => {
        return sum + currentParticipant.participants;
    }, 0);

    //categorize participants
    const sureParticipants: ParticipantData[] = data.filter(
        (currentParticipant) => !currentParticipant.unsure,
    );
    const sureParticipantsCount: number = sureParticipants.reduce((sum, currentParticipant) => {
        return sum + currentParticipant.participants;
    }, 0);

    const unsureParticipants: ParticipantData[] = data.filter(
        (currentParticipant) => currentParticipant.unsure,
    );
    const unsureParticipantsCount: number = unsureParticipants.reduce((sum, currentParticipant) => {
        return sum + currentParticipant.participants;
    }, 0);

    const lines: string[] = [];

    const participantHeader = "# ✅ " + tMeetup("participantList.participants");
    const participantCount = bold(tMeetup("participantList.personsTotal")) +
            " " +
            inlineCode(totalParticipantsCount + "");

    lines.push(participantHeader);
    lines.push(participantCount);

    const confirmedParticipantHeader = "## 👍 " + tMeetup("participantList.confirmedParticipants");
    const confirmedParticipantCount = bold(tMeetup("participantList.persons")) + " " + inlineCode(sureParticipantsCount + "");

    lines.push(confirmedParticipantHeader);
    lines.push(confirmedParticipantCount);

    for (const participant of sureParticipants) {
        const currentParticipantData = printParticipantData(participant, true, false);
        lines.push(currentParticipantData);
    }

    const unsureParticipantHeader = "## 🤷 " + tMeetup("participantList.unsureParticipants");
    const unsureParticipantCount =  bold(tMeetup("participantList.persons")) + " " + inlineCode(unsureParticipantsCount + "");

    lines.push(unsureParticipantHeader);
    lines.push(unsureParticipantCount);

    for (const participant of unsureParticipants) {
        const currentParticipantData = printParticipantData(participant, true, false);
        lines.push(currentParticipantData);
    }

    return lines.join("\n");
}
