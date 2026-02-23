/**
 * Class for handling "Add participant" buttonpress in meetup info embeds
 */
import {ButtonInteraction} from "discord.js";
import {db} from "../database/Database";
import {MeetupRow} from "../database/table/Meetup";
import {MeetupParticipantRow} from "../database/table/MeetupParticipant";
import {tButton} from "../i18n";
import {getParticipantData} from "../util/createMeetupInfoEmbed";
import {ParticipantData} from "../util/editMeetupInfoEmbed";
import {AbstractParticipantButton} from "./AbstractParticipantButton";

export class MeetupAddParticipantButton extends AbstractParticipantButton{
    customId: string = "meetup_add_participant";
    protected defaultUnsureState: boolean = false;
    protected defaultRemoteState: boolean = false;

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        await super.checkPermissions(interaction);

        //check if this user has too many participants
        const meetupParticipant = this.context.meetupParticipant as MeetupParticipantRow;

        if(meetupParticipant && meetupParticipant.participants >= 10){
            throw new Error(tButton("meetupAddParticipant.error.maxParticipantsReached"));
        }
    }

    /**
     * Runs function of this button
     */
    protected async run(interaction: ButtonInteraction): Promise<void> {
        await interaction.deferUpdate();

        const meetup = this.context.meetup as MeetupRow;

        //check if meetup participant entry for this user and meetup even exist
        if(!this.context.meetupParticipant){
            await this.handleCreateNew(interaction.user.id);
        } else {
            await this.handleUpdateExisting(true);
        }

        const participantData: ParticipantData[] = await getParticipantData(meetup.meetupID);
        await this.updateMeetupEmbed(interaction, participantData);

        const participantListMessageID = meetup.participantListMessageID as string;
        await this.updateParticipantList(interaction, participantData, participantListMessageID);
    }

    /**
     * Creates a new participation entry for this user
     */
    protected async handleCreateNew(userID: string): Promise<void> {
        const meetup = this.context.meetup as MeetupRow;

        await db
            .insertInto("meetup_participant")
            .values({
                meetupID: meetup.meetupID,
                userID: userID,
                participants: 1,
                unsure: this.defaultUnsureState,
                remote: this.defaultRemoteState
            })
            .executeTakeFirstOrThrow();
    }
}