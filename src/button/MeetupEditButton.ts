/**
 * Class for handling "Edit meetup" buttonpress in meetup info embeds
 */
import {ButtonInteraction} from "discord.js";
import {modalsMap} from "../maps/modalsMap";
import {assertMessageHasValidMeetup} from "../permissions/assertMessageHasValidMeetup";
import {assertUserIsMeetupCreatorOrConfig} from "../permissions/assertUserIsMeetupCreatorOrConfig";
import {AbstractButton} from "./AbstractButton";

export class MeetupEditButton extends AbstractButton{
    customId: string = "meetup_edit:{d}";
    protected context: Record<string, unknown> = {};

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        //check meetup
        const messageID: string = interaction.message.id;
        const meetup = await assertMessageHasValidMeetup(messageID);

        assertUserIsMeetupCreatorOrConfig(interaction, meetup, false);
    }

    protected async run(interaction: ButtonInteraction): Promise<void> {
        //show modal
        const MeetupEditModalClass = modalsMap.get("meetup_edit:{d}");

        if (!MeetupEditModalClass) {
            return;
        }

        const editMeetupModal = new MeetupEditModalClass();
        await editMeetupModal.execute(interaction);
    }
}