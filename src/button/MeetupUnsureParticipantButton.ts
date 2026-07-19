import { ButtonInteraction } from "discord.js";
import { AuditLogAction } from "../constant/auditLogAction";
import { db } from "../database/Database";
import { createAuditLog } from "../database/table/AuditLog";
import { MeetupParticipantRow } from "../database/table/MeetupParticipant";
import { MeetupAddParticipantButton } from "./MeetupAddParticipantButton";

/**
 * Class for handling "unsure" buttonpress in meetup info embeds
 */

export class MeetupUnsureParticipantButton extends MeetupAddParticipantButton {
    customId: string = "meetup_unsure";
    defaultUnsureState: boolean = true;

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

        const newStatus = !meetupParticipant.unsure;

        await db
            .updateTable("meetup_participant")
            .set({
                unsure: newStatus,
            })
            .where("meetupID", "=", meetupParticipant.meetupID)
            .where("userID", "=", meetupParticipant.userID)
            .executeTakeFirstOrThrow();

        const auditAction = (newStatus ? AuditLogAction.MEETUP_PARTICIPANT_UNSURE_ENABLE : AuditLogAction.MEETUP_PARTICIPANT_UNSURE_DISABLE);

        await createAuditLog(auditAction, {
            userID: meetupParticipant.userID,
            meetupID: meetupParticipant.meetupID,
        });  
    }

    /**
     * Checks if user has too many participants
     */
    protected checkParticipants(): void {
        //not needed here
    }
}
