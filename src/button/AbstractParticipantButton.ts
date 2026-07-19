import { ButtonInteraction } from "discord.js";
import { AuditLogAction } from "../constant/auditLogAction";
import { db } from "../database/Database";
import { createAuditLog } from "../database/table/AuditLog";
import { MeetupRow } from "../database/table/Meetup";
import { MeetupParticipantRow } from "../database/table/MeetupParticipant";
import { assertMessageHasValidMeetup } from "../permission/assertMessageHasValidMeetup";
import { AbstractButton } from "./AbstractButton";

/**
 * Abstract Class for handling participant buttons
 */

export abstract class AbstractParticipantButton extends AbstractButton {
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
        const meetupParticipant: MeetupParticipantRow | undefined = await this.getMeetupParticipant(
            meetup.meetupID,
            userID,
        );

        //save relevant variables for run
        this.context.meetup = meetup;
        this.context.meetupParticipant = meetupParticipant;
    }

    /**
     * Updates existing participation entry for this user
     */
    protected async handleUpdateExisting(add: boolean): Promise<void> {
        const meetupParticipant = this.context.meetupParticipant as MeetupParticipantRow;
        const participantCount: number = add
            ? meetupParticipant.participants + 1
            : meetupParticipant.participants - 1;

        await db
            .updateTable("meetup_participant")
            .set({
                participants: participantCount,
            })
            .where("meetupID", "=", meetupParticipant.meetupID)
            .where("userID", "=", meetupParticipant.userID)
            .executeTakeFirstOrThrow();

        const auditAction = (add ? AuditLogAction.MEETUP_PARTICIPANT_ADD : AuditLogAction.MEETUP_PARTICIPANT_REMOVE);

        await createAuditLog(auditAction, {
            userID: meetupParticipant.userID,
            meetupID: meetupParticipant.meetupID,
            additionalInformation: `new count: ${participantCount}`,
        });   
    }

    /**
     * Gets user participant entry of this meetup
     */
    private async getMeetupParticipant(
        meetupID: number,
        userID: string,
    ): Promise<MeetupParticipantRow | undefined> {
        return (await db
            .selectFrom("meetup_participant")
            .selectAll()
            .where("meetupID", "=", meetupID)
            .where("userID", "=", userID)
            .executeTakeFirst()) as MeetupParticipantRow | undefined;
    }
}
