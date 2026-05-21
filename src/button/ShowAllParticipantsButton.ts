import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, MessageFlags } from "discord.js";
import { MeetupRow } from "../database/table/Meetup";
import { tButton } from "../i18n";
import { assertMessageIsValidParticipantListMessage } from "../permission/assertMessageIsValidParticipantListMessage";
import { getParticipantData } from "../util/meetup/createMeetupInfoEmbed";
import { createParticipantListMessage } from "../util/meetup/createParticipantListMessage";
import { splitMessage } from "../util/splitMessage";
import { AbstractButton } from "./AbstractButton";

/**
 * Class for handling "Show all participants" buttonpress in meetup participant list messages
 */

export class ShowAllParticipantsButton extends AbstractButton {
    customId: string = "show_all_participants:{d}";
    protected context: Record<string, unknown> = {};

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        //check meetup
        const messageID: string = interaction.message.id;
        const meetup: MeetupRow = await assertMessageIsValidParticipantListMessage(messageID);

        this.context.meetup = meetup;
    }

    protected async run(interaction: ButtonInteraction): Promise<void> {
        //post empheral + navigation Buttons
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        //get participant data
        const meetup = this.context.meetup as MeetupRow;
        const participantData = await getParticipantData(meetup.meetupID);

        //get pages
        const participantListMessage: string = createParticipantListMessage(participantData);
        const participantListPages: string[] = splitMessage(participantListMessage);

        //components
        const components = [];
        if(participantListPages.length > 1){
            //add navigation buttons
            const previousPageButton: ButtonBuilder = new ButtonBuilder()
                .setCustomId("show_participants_switch_page:{" + meetup.meetupID +",0}")
                .setLabel(tButton("showAllParticipants.previousPage"))
                .setEmoji("⬅️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true);

            const nextPageButton: ButtonBuilder = new ButtonBuilder()
                .setCustomId("show_participants_switch_page:{" + meetup.meetupID +",1}")
                .setLabel(tButton("showAllParticipants.nextPage"))
                .setEmoji("➡️")
                .setStyle(ButtonStyle.Secondary);

            const navigationButtonRow: ActionRowBuilder<ButtonBuilder> =
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    previousPageButton,
                    nextPageButton
                );

            components.push(navigationButtonRow);
        }

        await interaction.editReply({
            content: participantListPages[0],
            components: components,
        });
    }
}
