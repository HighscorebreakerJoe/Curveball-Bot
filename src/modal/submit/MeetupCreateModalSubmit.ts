import {MessageFlags, ModalSubmitFields, ModalSubmitInteraction} from "discord.js";
import {InsertResult} from "kysely";
import {getMeetupAllowedMentionsRoles} from "../../cache/meetupAllowedMentionsRoles";
import {getMeetupInfoChannel} from "../../cache/meetupChannels";
import {db} from "../../database/Database";
import {calculateYear} from "../../util/calculateYear";
import {checkForLinks} from "../../util/checkForLinks";
import {createMeetupInfoEmbed} from "../../util/createMeetupInfoEmbed";
import {createParticipantListMessage} from "../../util/createParticipantListMessage";
import {ParticipantData} from "../../util/editMeetupInfoEmbed";
import {getDynamicData} from "../../util/getDynamicIDData";
import {postSuccess} from "../../util/postEmbeds";
import {resetMeetupListChannel} from "../../util/resetMeetupListChannel";
import {sanitizeTextInput} from "../../util/sanitizeTextInput";

import {AbstractModalSubmit} from "./AbstractModalSubmit";

/**
 * Handles Create Modal submits
 */

export class MeetupCreateModalSubmit extends AbstractModalSubmit{
    customId: string = "meetup_create:{d}";
    dynamicId: boolean = true;

    protected async checkPermissions(interaction: ModalSubmitInteraction): Promise<void> {
        let roleIds: string[] = [];
        const inputRoleIds = getDynamicData(interaction.customId);

        if(inputRoleIds.length > 0) {
            roleIds = inputRoleIds.split(",");
        }

        this.setAdditionalData({
            roleIds: roleIds
        });
    }

    protected checkModalInputs(fields: ModalSubmitFields): void {
        //check pokémon
        const pokemon: string = sanitizeTextInput(fields.getTextInputValue("pokemon"));

        if(!pokemon.length){
            throw new Error("Du hast vergessen, ein Pokémon anzugeben. Wie kannst du nur?");
        }

        if(checkForLinks(pokemon)){
            throw new Error("Hey, bitte keine Links posten!");
        }

        //check location
        const location: string = sanitizeTextInput(fields.getTextInputValue("location"));

        if(!location.length){
            throw new Error("Du hast vergessen, einen Ort anzugeben. Wo sollen wir uns treffen?");
        }

        if(checkForLinks(location)){
            throw new Error("Hey, bitte keine Links posten!");
        }

        //check time
        const time: string = fields.getTextInputValue("time");

        if(!time.length){
            throw new Error("Du musst uns schon eine Uhrzeit angeben...");
        }

        const timeRegexp = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');

        if(!timeRegexp.test(time)){
            throw new Error("Die Uhrzeit muss dem Format HH:MM entsprechen");
        }

        const timeParts: string[] = time.split(":");
        if (timeParts.length !== 2) {
            throw new Error("Die Uhrzeit muss dem Format HH:MM entsprechen");
        }

        const [hour, minute] = timeParts.map(Number);

        const currentDate = new Date();
        currentDate.setSeconds(0, 0);

        //check date
        const date: string = fields.getTextInputValue("date");

        const dateRegexp = new RegExp('^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])$');

        if(!dateRegexp.test(date)){
            throw new Error("Das Datum muss dem Format TT.MM entsprechen");
        }

        const dateParts: string[] = date.split(".");
        if (dateParts.length !== 2) {
            throw new Error("Das Datum muss dem Format TT.MM entsprechen");
        }

        const [day, month] = dateParts.map(Number);
        const year: number = calculateYear(day, month);

        const dateObject = new Date(year, month - 1, day, hour, minute);

        if(dateObject.getDate() !== day || dateObject.getMonth() !== month - 1){
            throw new Error("Ungültiges Datum eingegeben");
        }

        if(dateObject < currentDate){
            throw new Error("Deine eingetragene Zeit liegt in der Vergangenheit. Wir können nicht Zeitreisen.");
        }

        //check note (optional)
        const note: string = sanitizeTextInput(fields.getTextInputValue("note"));

        if(note.length > 0){
            if(checkForLinks(note)){
                throw new Error("Hey, bitte keine Links posten!");
            }
        }

        //save inputs for later
        this.sanitizedInputs = {
            pokemon,
            location,
            time,
            date,
            note
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
                userID: interaction.user.id
            })
            .executeTakeFirstOrThrow();

        //get meetupID
        const meetupID: number = Number((meetupResult).insertId);

        //save meetup creator as meetup participant
        await db
            .insertInto("meetup_participant")
            .values({
                meetupID: meetupID,
                userID: interaction.user.id,
                participants: 1,
                unsure: false,
                remote: false
            })
            .executeTakeFirstOrThrow();

        //create and post meetup-embed
        let embedTitle: string = pokemon + ": Raid von " + interaction.user?.tag;

        const meetupCreatorParticipant: ParticipantData = {
            userID: interaction.user.id,
            nickname: interaction.user.displayName,
            participants: 1,
            remote: false,
            unsure: false
        };

        const {embed, components} = createMeetupInfoEmbed({
            embedTitle: embedTitle,
            authorName: interaction.user.tag,
            authorIconURL: interaction.user.displayAvatarURL(),
            pokemon: pokemon,
            location: location,
            toSaveDate: toSaveDate,
            note: note,
            meetupCreatorParticipant: meetupCreatorParticipant,
            meetupID: meetupID
        });

        //set role mentions
        const roleMentions: string[] = [];
        this.additionalData.roleIds.forEach((roleID: string) => {
            roleMentions.push(`<@&${roleID}>`)
        })

        const meetupInfoMessage = await getMeetupInfoChannel().send({
            content: roleMentions.join(" "),
            embeds: [embed],
            components: components,
            allowedMentions: {
                roles: Array.from(getMeetupAllowedMentionsRoles()),
                users: [],
                parse: []
            }
        });

        //create thread
        const meetupInfoThread = await meetupInfoMessage.startThread({
            name: `Meetup #${meetupID}: Absprache`,
            autoArchiveDuration: 60,
            reason: "Automatisch erzeugt"
        });

        //write participant message in thread

        const participantListMessage = await meetupInfoThread.send({
            content: createParticipantListMessage([meetupCreatorParticipant])
        })

        //update meetup
        await db
            .updateTable("meetup")
            .set({
                messageID: meetupInfoMessage.id,
                threadID: meetupInfoThread.id,
                participantListMessageID: participantListMessage.id
            })
            .where("meetupID", "=", meetupID)
            .execute();

        //reset meetup list channel
        await resetMeetupListChannel();

        //create success embed
        await postSuccess(interaction, "Dein Meetup wurde erfolgreich erstellt!");
    }

    /**
     * Calculates datetime to save based on provided date and time
     */
    protected getToSaveDate(time: string, date = ""): Date{
        const [hour, minute] = time.split(":").map(Number);

        const now = new Date(); //current date

        let toSaveDate: Date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hour,
            minute,
            0,
            0
        );

        if(date.length > 0){
            const dateParts: string[] = date.split(".");
            const [day, month] = dateParts.map(Number);
            const year: number = calculateYear(day, month);
            toSaveDate = new Date(
                year,
                month - 1,
                day,
                hour,
                minute,
                0,
                0
            );
        }

        return toSaveDate;
    }
}