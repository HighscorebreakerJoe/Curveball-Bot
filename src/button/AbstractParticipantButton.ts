/**
 * Abstract Class for handling participant buttons
 */
import {ButtonInteraction, EmbedBuilder} from "discord.js";
import {db} from "../database/Database";
import {MeetupRow} from "../database/table/Meetup";
import {MeetupParticipantRow} from "../database/table/MeetupParticipant";
import {assertMessageHasValidMeetup} from "../permission/assertMessageHasValidMeetup";
import {createParticipantListMessage} from "../util/createParticipantListMessage";
import {editMeetupInfoEmbed, ParticipantData} from "../util/editMeetupInfoEmbed";
import {AbstractButton} from "./AbstractButton";

export abstract class AbstractParticipantButton extends AbstractButton{
    protected context: Record<string, unknown> = {};

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        //check meetup
        const messageID: string = interaction.message.id;
        const meetup: MeetupRow = await assertMessageHasValidMeetup(messageID);

        //get participant entry
        const userID: string = interaction.user.id;
        const meetupParticipant: MeetupParticipantRow|undefined = await this.getMeetupParticipant(meetup.meetupID, userID);

        //save relevant variables for run
        this.context.meetup = meetup;
        this.context.meetupParticipant = meetupParticipant;
    }

    /**
     * Updates existing participation entry for this user
     */
    protected async handleUpdateExisting(add: boolean): Promise<void> {
        const meetupParticipant = this.context.meetupParticipant as MeetupParticipantRow;
        const participantCount: number = (add ? meetupParticipant.participants + 1 : meetupParticipant.participants - 1);

        await db
            .updateTable("meetup_participant")
            .set({
                participants: participantCount
            })
            .where("meetupID" , "=", meetupParticipant.meetupID)
            .where("userID" , "=", meetupParticipant.userID)
            .executeTakeFirstOrThrow();
    }

    /**
     * Updates meetup info embed
     */
    protected async updateMeetupEmbed(interaction: ButtonInteraction, participantData: ParticipantData[]): Promise<void> {
        const embed: EmbedBuilder = EmbedBuilder.from(interaction.message.embeds[0]);

        const newEmbed: EmbedBuilder = editMeetupInfoEmbed(embed, {
            participants: participantData
        })

        await interaction.message.edit({
            embeds: [newEmbed]
        });
    }

    /**
     * Updates participant list
     */
    protected async updateParticipantList(interaction: ButtonInteraction, participantData: ParticipantData[], participantListMessageID: string): Promise<void> {
        const participantListMessage = await interaction.message.thread?.messages.fetch(participantListMessageID);

        if(participantListMessage){
            await participantListMessage.edit({
                content: createParticipantListMessage(participantData)
            });
        }
    }

    /**
     * Gets user participant entry of this meetup
     */
    private async getMeetupParticipant(meetupID: number, userID: string): Promise<MeetupParticipantRow|undefined>{
        return await db
            .selectFrom("meetup_participant")
            .selectAll()
            .where("meetupID", "=", meetupID)
            .where("userID", "=", userID)
            .executeTakeFirst() as MeetupParticipantRow|undefined;
    }
}