import { bold, inlineCode } from "discord.js";
import { tMeetup } from "../../i18n";
import { ParticipantData } from "./editMeetupInfoEmbed";
import { printParticipantData } from "./printParticipantData";

type BuildState = {
    pages: string[];
    currentLines: string[];
    maxLength: number;
    newline: string;
};

export function createParticipantListPages(data: ParticipantData[], maxLength = 2000): string[] {
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

    const state: BuildState = {
        pages: [],
        currentLines: [],
        maxLength,
        newline: "\n",
    };

    //general participant info
    const participantHeader = "# ✅ " + tMeetup("participantList.participants");
    const participantCount = bold(tMeetup("participantList.personsTotal")) +
            " " +
            inlineCode(totalParticipantsCount + "");

    addLine(state, participantHeader);
    addLine(state, participantCount);

    //confirmed participants
    const confirmedParticipantHeader = "## 👍 " + tMeetup("participantList.confirmedParticipants");
    const confirmedParticipantCount = bold(tMeetup("participantList.persons")) + " " + inlineCode(sureParticipantsCount + "");

    addLine(state, confirmedParticipantHeader);
    addLine(state, confirmedParticipantCount);

    for (const participant of sureParticipants) {
        const currentParticipantData = printParticipantData(participant, true, false);
        addLine(state, currentParticipantData);
    }

    //unsure participants
    const unsureParticipantHeader = "## 🤷 " + tMeetup("participantList.unsureParticipants");
    const unsureParticipantCount = bold(tMeetup("participantList.persons")) + " " + inlineCode(unsureParticipantsCount + "");

    addLine(state, unsureParticipantHeader);
    addLine(state, unsureParticipantCount);

    for (const participant of unsureParticipants) {
        const currentParticipantData = printParticipantData(participant, true, false);
        addLine(state, currentParticipantData);
    }

    return finalizePages(state);
}

function addLine(state: BuildState, toAddLine: string): void {
    const currentLines = [...state.currentLines, toAddLine];
    
    const testPage = currentLines.join(state.newline);

    if (testPage.length > state.maxLength) {
        state.pages.push(
            state.currentLines.join(state.newline),
        );

        state.currentLines = [];
    }

    state.currentLines.push(toAddLine);
}

function finalizePages(state: BuildState): string[] {
    if (state.currentLines.length > 0) {
        state.pages.push(
            state.currentLines.join(state.newline),
        );
    }

    state.currentLines = [];

    return state.pages;
}
