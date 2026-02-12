/**
 * Class for handling "remote" buttonpress in meetup info embeds
 */
import {ButtonInteraction} from "discord.js";
import {db} from "../database/Database";
import {MeetupParticipantRow} from "../database/table/MeetupParticipant";
import {MeetupAddParticipantButton} from "./MeetupAddParticipantButton";

export class MeetupRemoteParticipantButton extends MeetupAddParticipantButton{
    customId: string = "meetup_remote";
    defaultRemoteState: boolean = true;

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        await super.checkPermissions(interaction);
    }

    /**
     * Updates existing participation entry for this user
     */
    protected async handleUpdateExisting(add: boolean): Promise<void> {
        const meetupParticipant = this.context.meetupParticipant as MeetupParticipantRow;

        await db
            .updateTable("meetup_participant")
            .set({
                remote: !meetupParticipant.remote
            })
            .where("meetupID" , "=", meetupParticipant.meetupID)
            .where("userID" , "=", meetupParticipant.userID)
            .executeTakeFirstOrThrow();
    }
}