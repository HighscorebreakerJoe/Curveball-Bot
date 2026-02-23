import {bold, inlineCode} from "discord.js";
import {tMeetup} from "../i18n";
import {ParticipantData} from "./editMeetupInfoEmbed";
import {printParticipantData} from "./printParticipantData";

export function createParticipantListMessage(data: ParticipantData[]): string{
    //sum up all participants
    const totalParticipantsCount: number = data.reduce((sum, currentParticipant) => {
        return sum + currentParticipant.participants;
    }, 0);

    //categorize participants
    const sureParticipants: ParticipantData[] = data.filter(currentParticipant => !currentParticipant.unsure);
    const sureParticipantsCount: number = sureParticipants.reduce((sum, currentParticipant) => {
        return sum + currentParticipant.participants;
    }, 0);

    const unsureParticipants: ParticipantData[] = data.filter(currentParticipant => currentParticipant.unsure);
    const unsureParticipantsCount: number = unsureParticipants.reduce((sum, currentParticipant) => {
        return sum + currentParticipant.participants;
    }, 0);


    const lines: string[] = [];

    lines.push("# ✅ " + tMeetup("participantList.participants"));
    lines.push(bold(tMeetup("participantList.personsTotal")) + " " + inlineCode(totalParticipantsCount + ""));

    lines.push("## 👍 " + tMeetup("participantList.confirmedParticipants"));
    lines.push(bold(tMeetup("participantList.persons")) + " " + inlineCode(sureParticipantsCount + ""));

    for(const participant of sureParticipants){
        lines.push(printParticipantData(participant, true, false));
    }

    lines.push("## 🤷 " + tMeetup("participantList.unsureParticipants"));
    lines.push(bold(tMeetup("participantList.persons")) + " " + inlineCode(unsureParticipantsCount + ""));

    for(const participant of unsureParticipants){
        lines.push(printParticipantData(participant, true, false));
    }

    return lines.join("\n");
}