import {EmbedBuilder, time, TimestampStyles} from "discord.js";
import {printParticipantData} from "./printParticipantData";

export interface ParticipantData {
    userID: string,
    nickname: string,
    participants: number,
    unsure: boolean,
    remote: boolean
}

export interface EditMeetupEmbedOptions {
    embedTitle?: string;
    pokemon?: string,
    location?: string,
    toSaveDate?: Date,
    note?: string,
    participants?: ParticipantData[];
}

export function editMeetupInfoEmbed(embed: EmbedBuilder, options: EditMeetupEmbedOptions): EmbedBuilder{
    const newEmbed: EmbedBuilder = EmbedBuilder.from(embed);

    if (options.embedTitle) {
        newEmbed.setTitle(options.embedTitle);
    }

    //TODO directly access fields without relying on fieldnames/emotes
    const fields = newEmbed.data.fields?.map(f => ({ ...f })) ?? [];

    if (options.pokemon) {
        const pokemonIndex = fields.findIndex(f => f.name.startsWith("👾"));
        if (pokemonIndex !== -1){
            fields[pokemonIndex].value = options.pokemon;
        }
    }

    if (options.location) {
        const locationIndex = fields.findIndex(f => f.name.startsWith("📍"));
        if (locationIndex !== -1){
            fields[locationIndex].value = options.location;
        }
    }

    if (options.toSaveDate) {
        const dateIndex = fields.findIndex(f => f.name.startsWith("📅"));
        if (dateIndex !== -1){
            fields[dateIndex].value = time(options.toSaveDate, TimestampStyles.LongDateShortTime);
        }

        const dateRemainIndex = fields.findIndex(f => f.name.startsWith("⏳"));
        if (dateRemainIndex !== -1){
            fields[dateRemainIndex].value = time(options.toSaveDate, TimestampStyles.RelativeTime);
        }
    }

    if (options.note) {
        const noteIndex = fields.findIndex(f => f.name.startsWith("📝"));
        if (noteIndex !== -1){
            fields[noteIndex].value = options.note;
        }
    }

    if (options.participants) {
        const participantsIndex: number = fields.findIndex(f => f.name.startsWith("✅"));
        const participantStrings: string[] = [];

        options.participants.slice(0, 10).forEach(
            participant => participantStrings.push(printParticipantData(participant, true))
        );

        if(options.participants.length > 10){
            participantStrings.push("Vollständige Liste im Absprachen-Thread")
        }

        if (participantsIndex !== -1){
            fields[participantsIndex].value = participantStrings.join("\n");
        }
    }

    newEmbed.setFields(fields);

    return newEmbed;
}