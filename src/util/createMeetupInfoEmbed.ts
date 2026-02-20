import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, time, TimestampStyles} from "discord.js";
import {getGuild} from "../cache/guild";
import {db} from "../database/Database";
import {ParticipantData} from "./editMeetupInfoEmbed";
import {printParticipantData} from "./printParticipantData";

export interface CreateMeetupEmbedOptions {
    embedTitle: string;
    authorName: string;
    authorIconURL: string;
    pokemon: string,
    location: string,
    toSaveDate: Date,
    note: string,
    meetupCreatorParticipant: ParticipantData;
    meetupID: number;
}

export interface CreateMeetupInfoEmbedReturn {
    embed: EmbedBuilder,
    components: ActionRowBuilder<ButtonBuilder>[]
}

export function createMeetupInfoEmbed(options: CreateMeetupEmbedOptions): CreateMeetupInfoEmbedReturn{
    const { embedTitle,
        authorName,
        authorIconURL,
        pokemon,
        location,
        toSaveDate,
        meetupID,
        meetupCreatorParticipant,
        note
    } = options;

    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle(embedTitle)
        .setColor(0xf4d7a1)
        .setAuthor({
            name: authorName,
            iconURL: authorIconURL
        })
        .addFields(
            {
                name: "👾 Pokémon", value: pokemon
            },
            {
                name: "📍 Treffpunkt", value: location
            },
            {
                name: "📅 Datum und Uhrzeit", value: time(toSaveDate, TimestampStyles.LongDateShortTime), inline: true
            },
            {
                name: "⏳ Verbleibende Zeit", value: time(toSaveDate, TimestampStyles.RelativeTime), inline: true
            },
            {
                name: "📝 Anmerkungen", value: (note.length ? note: "-")
            },
            {
                name: "✅ Zusagen", value: (meetupCreatorParticipant ? printParticipantData(meetupCreatorParticipant, true): "")
            }
        )
        .setFooter({
            text: "Meetup #" + meetupID
        });

    const addParticipantButton: ButtonBuilder = new ButtonBuilder()
        .setCustomId("meetup_add_participant")
        .setLabel("+ 1")
        .setEmoji("👍")
        .setStyle(ButtonStyle.Success);

    const removeParticipantButton: ButtonBuilder = new ButtonBuilder()
        .setCustomId("meetup_remove_participant")
        .setLabel("- 1")
        .setEmoji("👎")
        .setStyle(ButtonStyle.Danger);

    const unsureButton: ButtonBuilder = new ButtonBuilder()
        .setCustomId("meetup_unsure")
        .setLabel("Unsicher")
        .setEmoji("🤷")
        .setStyle(ButtonStyle.Primary);

    const remoteButton: ButtonBuilder = new ButtonBuilder()
        .setCustomId("meetup_remote")
        .setLabel("Fern")
        .setEmoji("🚀")
        .setStyle(ButtonStyle.Primary);

    const editButton: ButtonBuilder = new ButtonBuilder()
        .setCustomId("meetup_edit:" + meetupID)
        .setLabel("Bearbeiten")
        .setEmoji("✏️")
        .setStyle(ButtonStyle.Secondary);

    const deleteButton: ButtonBuilder = new ButtonBuilder()
        .setCustomId("meetup_delete:" + meetupID)
        .setLabel("Löschen")
        .setEmoji("🗑️")
        .setStyle(ButtonStyle.Secondary);

    const participantButtonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
        addParticipantButton,
        removeParticipantButton
    );

    const stateButtonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
        unsureButton,
        remoteButton
    );

    const authorButtonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
        editButton,
        deleteButton
    );

    return {
        embed: embed,
        components: [participantButtonRow, stateButtonRow, authorButtonRow]
    }
}

export async function getParticipantData(meetupID: number): Promise<ParticipantData[]> {
    const meetupUserRows = await db
        .selectFrom("meetup_participant")
        .select(["userID", "participants", "unsure", "remote"])
        .where("meetupID", "=", meetupID)
        .execute();

    const userIDs: string[] = meetupUserRows.map((row) => row.userID);

    const members = await getGuild().members.fetch({ user: userIDs });

    const participantData: ParticipantData[] = [];

    for (const row of meetupUserRows) {
        const member = members.get(row.userID);

        participantData.push({
            userID: row.userID,
            nickname: (member && member.displayName ? member.displayName : "Unbekannt"),
            participants: row.participants,
            unsure: row.unsure,
            remote: row.remote
        });
    }

    return participantData;
}