import { hyperlink, MessageFlags, ModalSubmitFields, ModalSubmitInteraction } from "discord.js";
import { InsertResult } from "kysely";
import { getMeetupAllowedMentionsRoles } from "../../cache/meetupAllowedMentionsRoles";
import { getMeetupInfoChannel } from "../../cache/meetupChannels";
import { db } from "../../database/Database";
import { tCommon, tMeetup, tModal } from "../../i18n";
import { calculateYear } from "../../util/calculateYear";
import { checkForLinks } from "../../util/checkForLinks";
import { createMeetupInfoEmbed } from "../../util/createMeetupInfoEmbed";
import { createParticipantListMessage } from "../../util/createParticipantListMessage";
import { ParticipantData } from "../../util/editMeetupInfoEmbed";
import { getDynamicData } from "../../util/getDynamicIDData";
import { postSuccess } from "../../util/postEmbeds";
import { resetMeetupListChannel } from "../../util/resetMeetupListChannel";
import { sanitizeTextInput } from "../../util/sanitizeTextInput";

import { AbstractModalSubmit } from "./AbstractModalSubmit";

/**
 * Handles Create Modal submits
 */

export class MeetupCreateModalSubmit extends AbstractModalSubmit {
    customId: string = "meetup_create:{d}";
    dynamicId: boolean = true;

    protected async checkPermissions(interaction: ModalSubmitInteraction): Promise<void> {
        let roleIds: string[] = [];
        const inputRoleIds = getDynamicData(interaction.customId);

        if (inputRoleIds.length > 0) {
            roleIds = inputRoleIds.split(",");
        }

        this.setAdditionalData({
            roleIds: roleIds,
        });
    }

    protected checkModalInputs(fields: ModalSubmitFields): void {
        //check pokémon
        const pokemon: string = sanitizeTextInput(fields.getTextInputValue("pokemon"));

        if (!pokemon.length) {
            throw new Error(tModal("meetupCreate.submit.error.pokemonEmpty"));
        }

        if (checkForLinks(pokemon)) {
            throw new Error(tCommon("error.linkDetected"));
        }

        //check location
        const location: string = sanitizeTextInput(fields.getTextInputValue("location"));

        if (!location.length) {
            throw new Error(tModal("meetupCreate.submit.error.locationEmpty"));
        }

        if (checkForLinks(location)) {
            throw new Error(tCommon("error.linkDetected"));
        }

        //check time
        const time: string = fields.getTextInputValue("time");

        if (!time.length) {
            throw new Error(tModal("meetupCreate.submit.error.timeEmpty"));
        }

        const timeRegexp = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");

        if (!timeRegexp.test(time)) {
            throw new Error(tModal("meetupCreate.submit.error.timeWrongFormat"));
        }

        const timeParts: string[] = time.split(":");
        if (timeParts.length !== 2) {
            throw new Error(tModal("meetupCreate.submit.error.timeWrongFormat"));
        }

        const [hour, minute] = timeParts.map(Number);

        const currentDate = new Date();
        currentDate.setSeconds(0, 0);

        //check date
        const date: string = fields.getTextInputValue("date");

        if (!date.length) {
            throw new Error(tModal("meetupCreate.submit.error.dateEmpty"));
        }

        const dateRegexp = new RegExp("^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])$");

        if (!dateRegexp.test(date)) {
            throw new Error(tModal("meetupCreate.submit.error.dateWrongFormat"));
        }

        const dateParts: string[] = date.split(".");
        if (dateParts.length !== 2) {
            throw new Error(tModal("meetupCreate.submit.error.dateWrongFormat"));
        }

        const [day, month] = dateParts.map(Number);
        const year: number = calculateYear(day, month);

        const dateObject = new Date(year, month - 1, day, hour, minute);

        if (dateObject.getDate() !== day || dateObject.getMonth() !== month - 1) {
            throw new Error(tModal("meetupCreate.submit.error.dateInvalid"));
        }

        if (dateObject < currentDate) {
            throw new Error(tModal("meetupCreate.submit.error.dateInThePast"));
        }

        //check note (optional)
        const note: string = sanitizeTextInput(fields.getTextInputValue("note"));

        if (note.length > 0) {
            if (checkForLinks(note)) {
                throw new Error(tCommon("error.linkDetected"));
            }
        }

        //save inputs for later
        this.sanitizedInputs = {
            pokemon,
            location,
            time,
            date,
            note,
        };
    }

    /**
     * Posts meetup after modal inputs have been successfully validated
     */
    protected async successModalInputs(interaction: ModalSubmitInteraction): Promise<void> {
        //post defer reply to prevent timeout errors
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const { pokemon, location, time, date, note } = this.sanitizedInputs;

        //handle date
        const toSaveDate: Date = this.getToSaveDate(time, date);

        //save in database
        const meetupResult: InsertResult = await db
            .insertInto("meetup")
            .values({
                pokemon: pokemon,
                location: location,
                note: note,
                time: toSaveDate,
                userID: interaction.user.id,
            })
            .executeTakeFirstOrThrow();

        //get meetupID
        const meetupID: number = Number(meetupResult.insertId);

        //save meetup creator as meetup participant
        await db
            .insertInto("meetup_participant")
            .values({
                meetupID: meetupID,
                userID: interaction.user.id,
                participants: 1,
                unsure: false,
                remote: false,
            })
            .executeTakeFirstOrThrow();

        //create and post meetup-embed
        let embedTitle: string =
            pokemon + ": " + tMeetup("info.titleRaidFrom") + " " + interaction.user?.tag;

        const meetupCreatorParticipant: ParticipantData = {
            userID: interaction.user.id,
            nickname: interaction.user.displayName,
            participants: 1,
            remote: false,
            unsure: false,
        };

        const { embed, components } = createMeetupInfoEmbed({
            embedTitle: embedTitle,
            authorName: interaction.user.tag,
            authorIconURL: interaction.user.displayAvatarURL(),
            pokemon: pokemon,
            location: location,
            toSaveDate: toSaveDate,
            note: note,
            meetupCreatorParticipant: meetupCreatorParticipant,
            meetupID: meetupID,
        });

        //set role mentions
        const roleMentions: string[] = [];
        this.additionalData.roleIds.forEach((roleID: string) => {
            roleMentions.push(`<@&${roleID}>`);
        });

        const meetupInfoMessage = await getMeetupInfoChannel().send({
            content: roleMentions.join(" "),
            embeds: [embed],
            components: components,
            allowedMentions: {
                roles: Array.from(getMeetupAllowedMentionsRoles()),
                users: [],
                parse: [],
            },
        });

        //create thread
        const meetupInfoThread = await meetupInfoMessage.startThread({
            name: tMeetup("info.threadTitle", { meetupID: meetupID }),
            autoArchiveDuration: 60,
            reason: tMeetup("info.threadDefaultCreateReason"),
        });

        //write participant message in thread

        const participantListMessage = await meetupInfoThread.send({
            content: createParticipantListMessage([meetupCreatorParticipant]),
        });

        //update meetup
        await db
            .updateTable("meetup")
            .set({
                messageID: meetupInfoMessage.id,
                threadID: meetupInfoThread.id,
                participantListMessageID: participantListMessage.id,
            })
            .where("meetupID", "=", meetupID)
            .execute();

        //reset meetup list channel
        await resetMeetupListChannel();

        //create success embed
        await postSuccess(
            interaction,
            tMeetup("info.createSuccess") +
                " " +
                hyperlink(tMeetup("info.createSuccessLink"), meetupInfoMessage.url),
        );
    }

    /**
     * Calculates datetime to save based on provided date and time
     */
    protected getToSaveDate(time: string, date = ""): Date {
        const [hour, minute] = time.split(":").map(Number);

        const now = new Date(); //current date

        let toSaveDate: Date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
            minute,
            0,
            0,
        );

        if (date.length > 0) {
            const dateParts: string[] = date.split(".");
            const [day, month] = dateParts.map(Number);
            const year: number = calculateYear(day, month);
            toSaveDate = new Date(year, month - 1, day, hour, minute, 0, 0);
        }

        return toSaveDate;
    }
}
