import { ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, Channel, ComponentType, EmbedBuilder, Message } from "discord.js";
import { getMeetupInfoChannel, getMeetupListChannel } from "../cache/meetupChannels";
import { client } from "../client";
import { MeetupRow } from "../database/table/Meetup";
import { createParticipantListPages } from "../util/meetup/createParticipantListPages";
import { editMeetupInfoEmbed, ParticipantData } from "../util/meetup/editMeetupInfoEmbed";
import { generateMeetupListMessage } from "../util/meetup/generareMeetupListMessage";
import { sendChunkedMessages } from "../util/sendChunkedMessages";
import { tButton } from "../i18n";

/**
 * Manager for handling Discord UI updates (messages and threads).
 * Used for frequently updated or batched message rendering.
 */

class UIManager {

    /**
     * Resets meetup list and generates message listing all currently available meetups from now on
     */
    public async resetMeetupListChannel(): Promise<void> {
        //clear meetup list channel
        const messages = await getMeetupListChannel().messages.fetch({ limit: 100 });
        await getMeetupListChannel().bulkDelete(messages);

        //post new list
        const meetupListMessage: string = await generateMeetupListMessage();
        if (meetupListMessage.length > 0) {
            await sendChunkedMessages(meetupListMessage, getMeetupListChannel());
        }
    }

    /**
     * Updates info embed of a specific meetup
     */
    public async updateMeetupInfoEmbed(
        meetup: MeetupRow,
        participantData: ParticipantData[]
    ): Promise<void> {
        if(!meetup.messageID) {
            return;
        }

        const message: Message = await getMeetupInfoChannel().messages.fetch(meetup.messageID);

        if (!message) { 
            return;
        }

        const embed: EmbedBuilder = EmbedBuilder.from(message.embeds[0]);

        const newEmbed: EmbedBuilder = editMeetupInfoEmbed(embed, {
            participants: participantData,
        });

        await message.edit({
            embeds: [newEmbed],
        });
    }

    /**
     * Updates participant list of a specific meetup
     */
    public async updateParticipantList(
        meetup: MeetupRow,
        participantData: ParticipantData[]
    ): Promise<void> {
        if(!meetup.threadID || !meetup.participantListMessageID) {
            return;
        }

        const thread: Channel|null = await client.channels.fetch(meetup.threadID);
        if (!thread || !thread.isThread()) {
            return;
        }

        const message: Message = await thread.messages.fetch(meetup.participantListMessageID);
        if (!message) { 
            return;
        }

        const participantPages: string[] = createParticipantListPages(participantData);
        const components: ActionRowBuilder<ButtonBuilder>[] = [];

        if(participantPages.length > 1){
            //add button
            const showAllParticipantsButton: ButtonBuilder = new ButtonBuilder()
                .setCustomId("show_all_participants:" + meetup.meetupID)
                .setLabel(tButton("showAllParticipants.show"))
                .setEmoji("👪")
                .setStyle(ButtonStyle.Secondary);

            const showAllParticipantsButtonRow: ActionRowBuilder<ButtonBuilder> =
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    showAllParticipantsButton,
                );

            components.push(showAllParticipantsButtonRow);
        }

         await message.edit({
            content: participantPages[0],
            components: components
        });
    }

    private hasShowFullParticipantListButton(message: Message): boolean {
        return message.components.some((row) =>{
            if (row.type !== ComponentType.ActionRow) {
                return false;
            }

            return row.components.some((component) => {
                return (
                    component.type === ComponentType.Button &&
                    (component as ButtonComponent).customId?.startsWith("show_all_participants")
                );
            });
        });
    }
}

export const uiManager = new UIManager();