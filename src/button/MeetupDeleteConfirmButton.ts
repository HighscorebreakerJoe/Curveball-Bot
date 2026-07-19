import { ButtonInteraction, Message, User } from "discord.js";
import { deleteMeetupData } from "../cleanup/deleteMeetupData";
import { MeetupRow } from "../database/table/Meetup";
import { tButton, tCommand, tCommon } from "../i18n";
import { scheduleManager } from "../manager/ScheduleManager";
import { assertMeetupIDIsValid } from "../permission/assertMeetupIDIsValid";
import { assertUserIsMeetupCreatorOrConfig } from "../permission/assertUserIsMeetupCreatorOrConfig";
import { getDynamicData } from "../util/getDynamicIDData";
import { prepareEmbedMessage } from "../util/postEmbeds";
import { AbstractButton } from "./AbstractButton";

/**
 * Class for handling "Meetup delete confirm" buttonpress in meetup delete embeds
 */

export class MeetupDeleteConfirmButton extends AbstractButton {
    customId: string = "meetup_delete_confirm:{d}";
    protected context: Record<string, unknown> = {};

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        const meetupID: number = Number(getDynamicData(interaction.customId));

        if (Number.isNaN(meetupID)) {
            throw new Error(tCommand("error.notANumber", { var: "meetupID" }));
        }

        const meetup: MeetupRow = await assertMeetupIDIsValid(meetupID);

        //check if current user is mod or creator of this meetup
        await assertUserIsMeetupCreatorOrConfig(interaction, meetup, true);

        //save relevant variables for run
        this.context.meetup = meetup;
    }

    protected async run(interaction: ButtonInteraction): Promise<void> {
        //post delete prompt to user
        const meetup = this.context.meetup as MeetupRow;

        const user: User = interaction.user;

        await deleteMeetupData([meetup.meetupID], false, user?.id);
        
        //schedule meetup list channel reset
        scheduleManager.scheduleResetMeetupList();

        const message: Message = interaction.message;        
        await message.delete();

        await this.postConfirmSuccess(user);
    }

    protected async postConfirmSuccess(user: User) {
        const embed = prepareEmbedMessage(tButton("meetupDeleteConfirm.success"), tCommon("successDefaultEmbedTitle"), 0x00ff00);
        
        await user.send({
            embeds: [embed],
            components: [],
        });
    }
}
