import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { AbstractButton } from "./AbstractButton";
import { MeetupRow } from "../database/table/Meetup";
import { getParticipantData } from "../util/meetup/createMeetupInfoEmbed";
import { createParticipantListPages } from "../util/meetup/createParticipantListPages";
import { tButton, tPermission } from "../i18n";
import { getDynamicData } from "../util/getDynamicIDData";
import { assertMeetupIDIsValid } from "../permission/assertMeetupIDIsValid";

/**
 * Class for handling "Show participants switch page" buttonpress in ephemeral meetup participant list messages
 */

export class ShowParticipantsSwitchPageButton extends AbstractButton {
    customId: string = "show_participants_switch_page:{d}";
    protected context: Record<string, unknown> = {};

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        //get dynamic data
        const dynamicData: number[] = getDynamicData(interaction.customId).replace(/[{}]/g, "").split(",").map(Number);

        if(dynamicData.length !== 2){
            throw new Error(tPermission("error.invalidDynamicData"));
        }
        
        //check meetup
        const meetupID: number = dynamicData[0];
        const meetup: MeetupRow = await assertMeetupIDIsValid(meetupID);

        //check page
        const pageNo: number = dynamicData[1];
        if(pageNo < 0){
            throw new Error(tPermission("error.invalidPageNumber"));
        }

        this.context.meetup = meetup;
        this.context.pageNo = pageNo;
    }

    protected async run(interaction: ButtonInteraction): Promise<void> {
        const pageNo = this.context.pageNo as number;

        //get participant data
        const meetup = this.context.meetup as MeetupRow;
        const participantData = await getParticipantData(meetup.meetupID);

        //get pages
        const participantPages = createParticipantListPages(participantData);
        const lastPage = participantPages.length - 1;

        let toSwitchPageNo = pageNo;

        if(toSwitchPageNo < 0 || toSwitchPageNo > lastPage){
            //get next available page (go pages up or down depending on position)
            toSwitchPageNo = Math.max(0, Math.min(pageNo, lastPage));
        }

        //components
        const components: ActionRowBuilder<ButtonBuilder>[] = [];
        if(participantPages.length > 1){
            let previousPage = (toSwitchPageNo - 1 <= 0 ? 0 : toSwitchPageNo - 1);
            let nextPage = (toSwitchPageNo + 1 >= lastPage ? lastPage : toSwitchPageNo + 1);

            //add navigation buttons
            const previousPageButton: ButtonBuilder = new ButtonBuilder()
                .setCustomId("show_participants_switch_page:{" + meetup.meetupID + "," + previousPage  + "}")
                .setLabel(tButton("showAllParticipants.previousPage"))
                .setEmoji("⬅️")
                .setStyle(ButtonStyle.Secondary);

            if(toSwitchPageNo <= 0){
                previousPageButton.setDisabled(true);
            }

            const nextPageButton: ButtonBuilder = new ButtonBuilder()
                .setCustomId("show_participants_switch_page:{" + meetup.meetupID + "," + nextPage  + "}")
                .setLabel(tButton("showAllParticipants.nextPage"))
                .setEmoji("➡️")
                .setStyle(ButtonStyle.Secondary);

            if(toSwitchPageNo >= lastPage){
                nextPageButton.setDisabled(true);
            }

            const navigationButtonRow: ActionRowBuilder<ButtonBuilder> =
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    previousPageButton,
                    nextPageButton
                );

            components.push(navigationButtonRow);
        }

        await interaction.update({
            content: participantPages[toSwitchPageNo],
            components: components,
        });
    }
}
