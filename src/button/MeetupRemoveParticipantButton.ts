/**
 * Class for handling "Remove participant" buttonpress in meetup info embeds
 */
import {ButtonInteraction} from "discord.js";
import {db} from "../database/Database";
import {MeetupRow} from "../database/table/Meetup";
import {MeetupParticipantRow} from "../database/table/MeetupParticipant";
import {getParticipantData} from "../util/createMeetupInfoEmbed";
import {ParticipantData} from "../util/editMeetupInfoEmbed";
import {AbstractParticipantButton} from "./AbstractParticipantButton";

export class MeetupRemoveParticipantButton extends AbstractParticipantButton{
    customId: string = "meetup_remove_participant";

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        await super.checkPermissions(interaction);

        //check if this user is participant
        const meetupParticipant = this.context.meetupParticipant as MeetupParticipantRow;

        if(!meetupParticipant){
            throw new Error("Du bist in diesem Meetup nicht als Teilnehmer markiert. Verdrückt?")
        }
    }

    /**
     * Runs function of this button
     */
    protected async run(interaction: ButtonInteraction): Promise<void> {
        await interaction.deferUpdate();

        const meetup = this.context.meetup as MeetupRow;
        const meetupParticipant = this.context.meetupParticipant as MeetupParticipantRow;

        //check if meetup participant entry for this user and meetup even exist
        if(meetupParticipant.participants <= 1){
            await this.handleRemoveExisting();
        } else {
            await this.handleUpdateExisting(false);
        }

        const participantData: ParticipantData[] = await getParticipantData(meetup.meetupID);
        await this.updateMeetupEmbed(interaction, participantData);

        const participantListMessageID = meetup.participantListMessageID as string;
        await this.updateParticipantList(interaction, participantData, participantListMessageID);
    }

    /**
     * Removes existing participation entry of this user
     */
    private async handleRemoveExisting(): Promise<void> {
        const meetupParticipant = this.context.meetupParticipant as MeetupParticipantRow;

        await db
            .deleteFrom("meetup_participant")
            .where("meetupID" , "=", meetupParticipant.meetupID)
            .where("userID" , "=", meetupParticipant.userID)
            .executeTakeFirstOrThrow();
    }
}