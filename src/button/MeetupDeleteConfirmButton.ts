/**
 * Class for handling "Meetup delete confirm" buttonpress in meetup delete embeds
 */
import {ButtonInteraction} from "discord.js";
import {MeetupRow} from "../database/table/Meetup";
import {assertMeetupIDIsValid} from "../permissions/assertMeetupIDIsValid";
import {assertUserIsMeetupCreatorOrConfig} from "../permissions/assertUserIsMeetupCreatorOrConfig";
import {deleteMeetupData} from "../util/deleteMeetupData";
import {getDynamicData} from "../util/getDynamicIDData";
import {postSuccess} from "../util/postEmbeds";
import {AbstractButton} from "./AbstractButton";

export class MeetupDeleteConfirmButton extends AbstractButton{
    customId: string = "meetup_delete_confirm:{d}";
    protected context: Record<string, unknown> = {};

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        const meetupID: number = Number(getDynamicData(interaction.customId));

        if(Number.isNaN(meetupID)){
            throw new Error("Keine gültige meetupID angegeben");
        }

        const meetup: MeetupRow = await assertMeetupIDIsValid(meetupID);

        //check if current user is mod or creator of this meetup
        assertUserIsMeetupCreatorOrConfig(interaction, meetup, true);

        //save relevant variables for run
        this.context.meetup = meetup;
    }

    protected async run(interaction: ButtonInteraction): Promise<void> {
        //post delete prompt to user
        const meetup = this.context.meetup as MeetupRow;

        await deleteMeetupData([meetup.meetupID]);

        await postSuccess(interaction, "Dein Meetup wurde erfolgreich gelöscht.");
    }
}